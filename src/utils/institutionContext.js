const PENDING_INSTITUTION_SIGNUP_KEY = "campustok:pending-institution-signups";

const normalizeString = (value) =>
  typeof value === "string" ? value.trim() : "";

const normalizeId = (value) => {
  if (value === null || value === undefined) {
    return null;
  }

  const normalizedValue = String(value).trim();
  return normalizedValue || null;
};

const normalizeLookup = (value) =>
  normalizeString(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");

export const normalizeInstitutionRecord = (record = {}) => {
  if (!record || typeof record !== "object") {
    return null;
  }

  const id =
    normalizeId(record.id) ||
    normalizeId(record._id) ||
    normalizeId(record.institution_id);
  const name = normalizeString(
    record.name || record.institution_name || record.full_name,
  );
  const code = normalizeString(
    record.code || record.abbreviation || record.short_name,
  );
  const address = normalizeString(
    record.address || record.location || record.institution_location,
  );
  const logo = normalizeString(
    record.logo ||
      record.image_url ||
      record.profile_picture ||
      record.institution_profile_picture,
  );
  const email = normalizeString(record.email || record.institution_email);
  const type = normalizeString(record.type || record.role || record.userType);

  if (!id && !name && !code) {
    return null;
  }

  return {
    id: id || name || code,
    name: name || code || "Institution",
    code: code || null,
    address: address || null,
    logo: logo || null,
    email: email || null,
    type: type || "institution",
  };
};

export const mergeInstitutionRecords = (primary, secondary) => {
  const normalizedPrimary = normalizeInstitutionRecord(primary);
  const normalizedSecondary = normalizeInstitutionRecord(secondary);

  if (!normalizedPrimary) {
    return normalizedSecondary;
  }

  if (!normalizedSecondary) {
    return normalizedPrimary;
  }

  return {
    ...normalizedSecondary,
    ...normalizedPrimary,
    id: normalizedPrimary.id || normalizedSecondary.id,
    name: normalizedPrimary.name || normalizedSecondary.name || "Institution",
    code: normalizedPrimary.code || normalizedSecondary.code || null,
    address:
      normalizedPrimary.address || normalizedSecondary.address || null,
    logo: normalizedPrimary.logo || normalizedSecondary.logo || null,
    email: normalizedPrimary.email || normalizedSecondary.email || null,
    type: normalizedPrimary.type || normalizedSecondary.type || "institution",
  };
};

export const getInstitutionSelectionFromAuthSource = (source = {}) => {
  if (!source || typeof source !== "object") {
    return null;
  }

  const profile = source.institution_profile || source.student_profile;

  if (!profile || typeof profile !== "object") {
    return normalizeInstitutionRecord({
      id: source.institution_id,
      institution_name: source.institution_name || source.school,
      institution_location: source.institution_location || source.address,
      institution_profile_picture: source.logo || source.profile_picture,
      institution_email: source.institution_email || source.email,
      code: source.institution_code || source.code,
      type: source.role || source.userType,
    });
  }

  return normalizeInstitutionRecord({
    id: profile.id || profile.institution_id || source.institution_id,
    institution_name:
      profile.institution_name || source.institution_name || source.school,
    institution_location:
      profile.institution_location ||
      source.institution_location ||
      source.address,
    institution_profile_picture:
      profile.institution_profile_picture ||
      source.logo ||
      source.profile_picture,
    institution_email:
      profile.institution_email || source.institution_email || source.email,
    code: profile.code || source.institution_code || source.code,
    type: source.role || source.userType,
  });
};

export const findMatchingInstitution = (schools = [], targetInstitution) => {
  const normalizedTarget = normalizeInstitutionRecord(targetInstitution);

  if (!normalizedTarget) {
    return null;
  }

  const targetId = normalizeId(normalizedTarget.id);
  const targetNameLookup = normalizeLookup(normalizedTarget.name);
  const targetCodeLookup = normalizeLookup(normalizedTarget.code);

  return (
    schools
      .map((school) => normalizeInstitutionRecord(school))
      .find((school) => {
        if (!school) {
          return false;
        }

        const schoolId = normalizeId(school.id);
        const schoolNameLookup = normalizeLookup(school.name);
        const schoolCodeLookup = normalizeLookup(school.code);

        return (
          (targetId && schoolId === targetId) ||
          (targetNameLookup && schoolNameLookup === targetNameLookup) ||
          (targetCodeLookup && schoolCodeLookup === targetCodeLookup)
        );
      }) || null
  );
};

export const institutionsMatch = (leftInstitution, rightInstitution) => {
  const left = normalizeInstitutionRecord(leftInstitution);
  const right = normalizeInstitutionRecord(rightInstitution);

  if (!left || !right) {
    return false;
  }

  return Boolean(findMatchingInstitution([left], right));
};

export const getInstitutionDisplayName = (
  institution,
  fallback = "Institution",
) => normalizeInstitutionRecord(institution)?.name || fallback;

export const resolveInstitutionFeedId = (
  institution,
  fallbackInstitutionId = "unilag",
) => {
  if (!institution || typeof institution !== "object") {
    return fallbackInstitutionId;
  }

  const normalizedInstitution = normalizeInstitutionRecord(institution);
  const explicitId =
    normalizeId(institution.id) ||
    normalizeId(institution._id) ||
    normalizeId(institution.institution_id);

  const normalizedExplicitId = normalizeLookup(explicitId);
  const normalizedInstitutionName = normalizeLookup(normalizedInstitution?.name);
  const normalizedInstitutionCode = normalizeLookup(normalizedInstitution?.code);
  const hasOpaqueExplicitId =
    Boolean(explicitId) &&
    (/^\d+$/.test(explicitId) ||
      /^[a-f0-9-]{8,}$/i.test(explicitId) ||
      (explicitId.includes("-") &&
        normalizedExplicitId !== normalizedInstitutionName &&
        normalizedExplicitId !== normalizedInstitutionCode));

  if (hasOpaqueExplicitId) {
    return explicitId;
  }

  const institutionLookup = [
    normalizedExplicitId,
    normalizeLookup(normalizedInstitution?.name),
    normalizeLookup(normalizedInstitution?.code),
    normalizeLookup(normalizedInstitution?.type),
  ]
    .filter(Boolean)
    .join(" ");

  if (
    institutionLookup.includes("unilag") ||
    institutionLookup.includes("universityoflagos")
  ) {
    return "unilag";
  }

  if (
    institutionLookup.includes("yabatech") ||
    institutionLookup.includes("yabacollegeoftechnology")
  ) {
    return "yabatech";
  }

  if (
    institutionLookup.includes("obafemiawolowo") ||
    institutionLookup.includes("oau") ||
    institutionLookup.includes("ileife")
  ) {
    return "ileife";
  }

  return fallbackInstitutionId;
};

export const getInstitutionInitials = (institutionName) => {
  const normalizedName = normalizeString(institutionName);

  if (!normalizedName) {
    return "IN";
  }

  const words = normalizedName.split(/\s+/).filter(Boolean);

  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }

  return words
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
};

const readPendingInstitutionSignups = () => {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const storedValue = window.localStorage.getItem(
      PENDING_INSTITUTION_SIGNUP_KEY,
    );

    if (!storedValue) {
      return {};
    }

    const parsedValue = JSON.parse(storedValue);
    return parsedValue && typeof parsedValue === "object" ? parsedValue : {};
  } catch (error) {
    console.warn("Unable to read pending institution signups:", error);
    return {};
  }
};

const writePendingInstitutionSignups = (pendingInstitutionSignups) => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(
    PENDING_INSTITUTION_SIGNUP_KEY,
    JSON.stringify(pendingInstitutionSignups),
  );
};

export const savePendingInstitutionSignup = ({
  email,
  role,
  institution,
}) => {
  if (
    typeof window === "undefined" ||
    !email ||
    !institution ||
    !["student", "institution"].includes(role)
  ) {
    return;
  }

  const normalizedInstitution = normalizeInstitutionRecord(institution);

  if (!normalizedInstitution) {
    return;
  }

  const normalizedEmail = email.toLowerCase().trim();
  const pendingInstitutionSignups = readPendingInstitutionSignups();

  pendingInstitutionSignups[normalizedEmail] = {
    role,
    institution: normalizedInstitution,
    updatedAt: Date.now(),
  };

  writePendingInstitutionSignups(pendingInstitutionSignups);
};

export const getPendingInstitutionSignup = (email) => {
  if (!email) {
    return null;
  }

  const pendingInstitutionSignups = readPendingInstitutionSignups();
  const pendingInstitution =
    pendingInstitutionSignups[email.toLowerCase().trim()];

  return normalizeInstitutionRecord(pendingInstitution?.institution);
};

export const clearPendingInstitutionSignup = (email) => {
  if (typeof window === "undefined" || !email) {
    return;
  }

  const normalizedEmail = email.toLowerCase().trim();
  const pendingInstitutionSignups = readPendingInstitutionSignups();

  if (!(normalizedEmail in pendingInstitutionSignups)) {
    return;
  }

  delete pendingInstitutionSignups[normalizedEmail];
  writePendingInstitutionSignups(pendingInstitutionSignups);
};
