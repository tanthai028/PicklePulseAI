# PicklePulse AI Changelog

## [Latest] - Mobile Responsiveness Improvements

### Container Width and Scaling
- Added `maxW="container.md"` to root containers for proper mobile scaling
- Fixed container width issues across all pages
- Improved responsive layout handling on mobile devices

### Layout Component Changes
- Added proper width constraints to main layout container
- Improved navbar width handling
- Enhanced mobile menu responsiveness

### Page-Specific Improvements
- **Dashboard**: 
  - Fixed container scaling issues
  - Improved responsive grid layout
  - Enhanced stats card display on mobile

- **Health Stats**: 
  - Fixed form container width issues
  - Improved mobile form layout
  - Enhanced button group spacing and alignment

- **Performance**: 
  - Fixed container scaling
  - Improved form width on mobile
  - Enhanced input field responsiveness

### Previous Updates

#### UI/UX Improvements
- Centered welcome/login screen
- Fixed navbar width consistency
- Updated health stats tracking (1-5 scale)
- Removed heart rate and calories tracking
- Added visual feedback to sliders
- Enhanced form controls and button styling

#### Schema Updates
- Modified health_stats table structure
- Added columns for sleep_hours, hunger, and soreness
- Implemented proper constraints and defaults
- Set up row-level security policies

#### Health Stats Form Redesign
- Changed sleep hours to dropdown (2-12 hours)
- Replaced sliders with button groups (1-5 rating)
- Improved mobile responsiveness
- Added better descriptive labels