// components/SchoolDropdown.jsx
import { useState, useEffect, useRef } from 'react';
import { ChevronDown, Search, Building2 } from 'lucide-react';

const SchoolDropdown = ({ 
  schools = [], 
  selectedSchool, 
  onSelectSchool, 
  isLoading = false,
  placeholder = "Select a school...",
  className = ""
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredSchools, setFilteredSchools] = useState(schools);
  const dropdownRef = useRef(null);

  // Filter schools based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredSchools(schools);
    } else {
      const filtered = schools.filter(school =>
        school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (school.code && school.code.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (school.address && school.address.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredSchools(filtered);
    }
  }, [searchTerm, schools]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (school) => {
    onSelectSchool(school);
    setIsOpen(false);
    setSearchTerm('');
  };

  // Format school data from API response
  const formatSchoolData = (school) => ({
    id: school.id,
    name: school.institution_name || school.name,
    code: school.code || school.id?.toUpperCase(),
    logo: school.institution_profile_picture || school.logo,
    address: school.institution_location || school.address,
    website: school.institution_website,
    email: school.institution_email,
    description: school.institution_description
  });

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Dropdown Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        disabled={isLoading}
        className={`
          w-full flex items-center justify-between px-4 py-3 
          bg-[#24223A] border border-gray-300 rounded-full
          hover:border-gray-400 focus:outline-none focus:ring-2 
          focus:ring-primary-500 focus:border-transparent
          transition-all duration-200
          ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          ${selectedSchool ? 'text-white' : 'text-gray-500'}
        `}
      >
        <div className="flex items-center gap-3 min-w-0">
          {selectedSchool?.logo ? (
            <img
              src={selectedSchool.logo}
              alt={selectedSchool.name}
              className="w-8 h-8 rounded-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextElementSibling.style.display = 'flex';
              }}
            />
          ) : (
            <div className="w-8 h-8 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-gray-400" />
            </div>
          )}
          {!selectedSchool?.logo && (
            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
              <Building2 className="w-5 h-5 text-primary-600" />
            </div>
          )}
          
          <div className="text-left truncate">
            {selectedSchool ? (
              <>
                <div className="font-medium truncate">{selectedSchool.name}</div>
                <div className="text-xs text-gray-300 truncate">
                  {selectedSchool.address}
                  {selectedSchool.code && ` • ${selectedSchool.code}`}
                </div>
              </>
            ) : (
              <div>{placeholder}</div>
            )}
          </div>
        </div>
        
        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-96 overflow-hidden">
          {/* Search Input */}
          <div className="p-3 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search schools..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                autoFocus
              />
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="py-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              <p className="mt-2 text-gray-500">Loading schools...</p>
            </div>
          )}

          {/* Schools List */}
          {!isLoading && filteredSchools.length > 0 && (
            <div className="overflow-y-auto max-h-64">
              {filteredSchools.map((school) => {
                const formattedSchool = formatSchoolData(school);
                const isSelected = selectedSchool?.id === formattedSchool.id;
                
                return (
                  <button
                    key={formattedSchool.id}
                    type="button"
                    onClick={() => handleSelect(formattedSchool)}
                    className={`
                      w-full flex items-center gap-3 px-4 py-3 text-left
                      hover:bg-gray-50 transition-colors
                      ${isSelected ? 'bg-primary-50 border-l-4 border-primary-600' : ''}
                    `}
                  >
                    {formattedSchool.logo ? (
                      <img
                        src={formattedSchool.logo}
                        alt={formattedSchool.name}
                        className="w-10 h-10 rounded-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextElementSibling.style.display = 'flex';
                        }}
                      />
                    ) : (
                      <div className="w-10 h-10 flex items-center justify-center">
                        <Building2 className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                    {!formattedSchool.logo && (
                      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                        <Building2 className="w-6 h-6 text-primary-600" />
                      </div>
                    )}
                    
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{formattedSchool.name}</div>
                      <div className="text-sm text-gray-500 truncate">
                        {formattedSchool.address}
                      </div>
                      {formattedSchool.code && (
                        <div className="text-xs text-gray-400 mt-1">
                          {formattedSchool.code}
                        </div>
                      )}
                    </div>
                    
                    {isSelected && (
                      <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* No Results */}
          {!isLoading && filteredSchools.length === 0 && (
            <div className="py-8 text-center text-gray-500">
              <Building2 className="w-12 h-12 mx-auto text-gray-300 mb-2" />
              <p>No schools found</p>
              <p className="text-sm mt-1">Try a different search term</p>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && schools.length === 0 && !isLoading && (
            <div className="py-8 text-center text-gray-500">
              <Building2 className="w-12 h-12 mx-auto text-gray-300 mb-2" />
              <p>No schools available</p>
              <p className="text-sm mt-1">Add schools or check your connection</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SchoolDropdown;


// components/SchoolDropdown.jsx
// import { useState, useEffect, useRef } from 'react';
// import { ChevronDown, Search, Building2 } from 'lucide-react';

// const SchoolDropdown = ({ 
//   schools = [], 
//   selectedSchool, 
//   onSelectSchool, 
//   isLoading = false,
//   placeholder = "Select a school...",
//   className = ""
// }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filteredSchools, setFilteredSchools] = useState(schools);
//   const dropdownRef = useRef(null);

//   // Filter schools based on search term
//   useEffect(() => {
//     if (searchTerm.trim() === '') {
//       setFilteredSchools(schools);
//     } else {
//       const filtered = schools.filter(school =>
//         school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         (school.code && school.code.toLowerCase().includes(searchTerm.toLowerCase())) ||
//         (school.address && school.address.toLowerCase().includes(searchTerm.toLowerCase()))
//       );
//       setFilteredSchools(filtered);
//     }
//   }, [searchTerm, schools]);

//   // Close dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setIsOpen(false);
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   const handleSelect = (school) => {
//     onSelectSchool(school);
//     setIsOpen(false);
//     setSearchTerm('');
//   };

//   // Format school data from API response
//   const formatSchoolData = (school) => ({
//     id: school.id,
//     name: school.institution_name || school.name,
//     code: school.code || school.id?.toUpperCase(),
//     logo: school.institution_profile_picture || school.logo,
//     address: school.institution_location || school.address,
//     website: school.institution_website,
//     email: school.institution_email,
//     description: school.institution_description
//   });

//   return (
//     <div className={`relative w-full ${className}`} ref={dropdownRef}>
//       {/* Dropdown Trigger - Now full width */}
//       <button
//         type="button"
//         onClick={() => setIsOpen(!isOpen)}
//         disabled={isLoading}
//         className={`
//           w-full flex items-center justify-between px-4 py-3 
//           bg-white border-2 border-gray-300 rounded-xl
//           hover:border-primary-400 focus:outline-none focus:border-primary-500 
//           transition-all duration-200 text-left
//           ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
//           ${selectedSchool ? 'text-gray-900' : 'text-gray-500'}
//         `}
//       >
//         <div className="flex items-center gap-3 min-w-0 flex-1">
//           {selectedSchool?.logo ? (
//             <img
//               src={selectedSchool.logo}
//               alt={selectedSchool.name}
//               className="w-8 h-8 rounded-full object-cover flex-shrink-0"
//             />
//           ) : (
//             <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
//               <Building2 className="w-5 h-5 text-primary-600" />
//             </div>
//           )}
          
//           <div className="truncate">
//             {selectedSchool ? (
//               <>
//                 <div className="font-medium truncate">{selectedSchool.name}</div>
//                 <div className="text-sm text-gray-500 truncate">
//                   {selectedSchool.address}
//                 </div>
//               </>
//             ) : (
//               <div className="font-medium">{placeholder}</div>
//             )}
//           </div>
//         </div>
        
//         <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform flex-shrink-0 ${isOpen ? 'transform rotate-180' : ''}`} />
//       </button>

//       {/* Dropdown Menu - Absolutely positioned with higher z-index */}
//       {isOpen && (
//         <div className="absolute z-50 w-full mt-2 bg-white border border-gray-300 rounded-xl shadow-xl max-h-96 overflow-hidden">
//           {/* Search Input */}
//           <div className="p-3 border-b">
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
//               <input
//                 type="text"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 placeholder="Search schools..."
//                 className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-lg"
//                 autoFocus
//               />
//             </div>
//           </div>

//           {/* Loading State */}
//           {isLoading && (
//             <div className="py-8 text-center">
//               <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
//               <p className="mt-2 text-gray-500">Loading schools...</p>
//             </div>
//           )}

//           {/* Schools List */}
//           {!isLoading && filteredSchools.length > 0 && (
//             <div className="overflow-y-auto max-h-64">
//               {filteredSchools.map((school) => {
//                 const formattedSchool = formatSchoolData(school);
//                 const isSelected = selectedSchool?.id === formattedSchool.id;
                
//                 return (
//                   <button
//                     key={formattedSchool.id}
//                     type="button"
//                     onClick={() => handleSelect(formattedSchool)}
//                     className={`
//                       w-full flex items-center gap-3 px-4 py-3 text-left
//                       hover:bg-primary-50 transition-colors
//                       ${isSelected ? 'bg-primary-100 border-l-4 border-primary-600' : ''}
//                     `}
//                   >
//                     {formattedSchool.logo ? (
//                       <img
//                         src={formattedSchool.logo}
//                         alt={formattedSchool.name}
//                         className="w-10 h-10 rounded-full object-cover flex-shrink-0"
//                       />
//                     ) : (
//                       <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
//                         <Building2 className="w-6 h-6 text-primary-600" />
//                       </div>
//                     )}
                    
//                     <div className="flex-1 min-w-0">
//                       <div className="font-medium truncate">{formattedSchool.name}</div>
//                       <div className="text-sm text-gray-500 truncate">
//                         {formattedSchool.address}
//                       </div>
//                       {formattedSchool.code && (
//                         <div className="text-xs text-primary-600 font-medium mt-1">
//                           {formattedSchool.code}
//                         </div>
//                       )}
//                     </div>
                    
//                     {isSelected && (
//                       <div className="w-2 h-2 bg-primary-600 rounded-full flex-shrink-0"></div>
//                     )}
//                   </button>
//                 );
//               })}
//             </div>
//           )}

//           {/* No Results */}
//           {!isLoading && filteredSchools.length === 0 && (
//             <div className="py-8 text-center text-gray-500">
//               <Building2 className="w-12 h-12 mx-auto text-gray-300 mb-2" />
//               <p className="font-medium">No schools found</p>
//               <p className="text-sm mt-1">Try a different search term</p>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default SchoolDropdown;