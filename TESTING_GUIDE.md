# Testing Guide - Login Pages & Dashboard Routing

## Development Server

The server should be running on **http://localhost:3000**

If not running, start it with:
```bash
npm run dev
```

## Testing Scenarios

### 1. Student Login Flow
1. Navigate to `/login`
2. Select **Student** card (left side)
3. Enter credentials (or any email/password for testing)
4. Check "Agree with Terms & Condition"
5. Click "Login" button
6. **Expected**: Should redirect to `/student-dashboard`
7. **Verify**: Student dashboard shows:
   - Welcome message with student stats
   - Active Courses, Assignments Due, GPA, Study Hours
   - Quick actions (View Courses, Messages, Community, Notifications)
   - Recent Activity and Upcoming Events

### 2. Institution Login Flow
1. Navigate to `/login`
2. Select **Institution** card (right side)
3. Enter credentials
4. Check "Agree with Terms & Condition"
5. Click "Login" button
6. **Expected**: Should redirect to `/institution-dashboard`
7. **Verify**: Institution dashboard shows:
   - Welcome message for institution
   - Stats: Total Students, Active Courses, Engagement Rate, Messages
   - Quick actions (Manage Students, Course Management, Analytics, Settings)
   - Recent Activity and Announcements

### 3. Continue Without Login (Guest)
1. Navigate to `/login`
2. Scroll down to find "Continue Without Login" button
3. Click the button
4. **Expected**: Should redirect to `/general-dashboard`
5. **Verify**: General dashboard shows:
   - Welcome message
   - Quick access buttons (Browse Feed, Watch Videos, Read Blog, etc.)
   - Trending Topics section
   - Feed Preview section

### 4. Google OAuth Login
1. Navigate to `/login`
2. Click "Continue with Google" button
3. Complete Google authentication
4. **Expected**: Should redirect based on user type from API:
   - `student` → `/student-dashboard`
   - `institution` → `/institution-dashboard`
   - Default → `/general-dashboard`

### 5. Form Validation
1. Try to submit without selecting user type → Should show error
2. Try to submit without username/email → Should show error
3. Try to submit without password → Should show error
4. Try to submit without checking terms → Should show alert

### 6. Mobile Responsiveness
1. Open browser DevTools (F12)
2. Toggle device toolbar (Ctrl/Cmd + Shift + M)
3. Test on mobile viewport (375px, 414px)
4. **Verify**:
   - Login page is responsive
   - User type cards stack properly
   - Form inputs are touch-friendly
   - All buttons are accessible

### 7. Navigation Tests
1. After logging in, check if:
   - Sidebar navigation works
   - Top navigation works
   - Bottom navigation works on mobile
   - Back button works to return to login

## API Testing Notes

- The login endpoint may not exist yet, so the code includes **fallback/dummy responses** for testing
- If you get a 404 or network error, the app will:
  - Use dummy user data based on selected user type
  - Still route correctly to the appropriate dashboard
  - Store user in auth store for session management

## Common Issues & Solutions

### Issue: Page not loading
- Check if server is running: Look for Vite output in terminal
- Check browser console for errors
- Verify all dependencies are installed: `npm install`

### Issue: Routing not working
- Clear browser cache and refresh
- Check React Router version matches
- Verify all route paths in `App.jsx` are correct

### Issue: Dashboard showing wrong user type
- Check `useAuthStore` state in browser DevTools
- Verify `userType` is being set correctly in login handler
- Check console logs for authentication flow

## Expected Console Logs

When testing, you should see:
- `Login successful:` with user data (if API works)
- `Login failed:` with error details (if API doesn't exist - this is expected)
- Dashboard routing messages
- Google OAuth flow messages (if testing Google login)

## Success Criteria

✅ All three dashboards are accessible
✅ Routing works correctly for each user type
✅ "Continue Without Login" works for guest access
✅ Form validation works properly
✅ Mobile responsive design works
✅ Error handling works (shows dummy data when API unavailable)
