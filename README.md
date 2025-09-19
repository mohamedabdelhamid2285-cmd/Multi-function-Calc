# Calculator App

    This is a multi-function calculator app built with React Native and Expo.

    ## Features

    *   Standard arithmetic operations (+, -, \*, /)
    *   Scientific functions (sin, cos, tan, log, sqrt, etc.)
    *   Memory functions (MS, MR, MC)
    *   Store function (STO)
    *   Angle unit conversions (DEG/RAD)
    *   Theme switching (light/dark)
    *   Google AdMob integration with Pro user support

    ## Getting Started

    1.  Install dependencies: `npm install`
    2.  Run the app: `npx expo start`

    ## AdMob Integration

    The app is prepared for Google AdMob monetization strategy:

    ### Ad Types
    - **Banner Ads**: Placeholder ads displayed at the bottom of Matrix, Vector, and Statistics screens (ready for AdMob integration)
    - **Interstitial Ads**: Logic ready for showing after every 10 calculations on the main calculator, and after successful calculations on advanced screens

    ### Pro User Support
    - Toggle Pro user status in Settings to remove all ads
    - Pro users see no banner or interstitial ads anywhere in the app

    ### AdMob Setup Required
    - Install `react-native-google-mobile-ads` package
    - Configure with your Google AdMob Test IDs
    - Replace with your actual Ad Unit IDs before publishing

    ### Current Status
    - Fallback banner ads showing on web preview
    - All ad logic implemented and ready for AdMob integration
    - Pro user functionality working

    ## Contributing

    Contributions are welcome! Please submit a pull request.

    ## License

    MIT License
