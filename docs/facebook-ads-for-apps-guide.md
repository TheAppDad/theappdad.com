# Facebook Ads for Apps: Step-by-Step Setup Guide

A guide to setting up and running Facebook/Meta Ads for your iOS app (Chosen). Based on [Meta's App Ads documentation](https://developers.facebook.com/docs/app-ads/).

---

## Overview: What You Need

| Component | Purpose |
|-----------|---------|
| **Meta Business Manager** | Manage ad accounts and link your app |
| **Meta Developer App** | Register your app, get App ID |
| **Ads Manager** | Create and run campaigns |
| **App Events (optional)** | Track installs, purchases; enables better optimization |
| **SDK (optional)** | Required for install tracking and app event optimization |

**Quick path**: You can run basic app ads with just an App Store URL (e.g. `https://www.theappdad.com/chosen`) and the **Traffic** or **App Promotion** objective—no app registration needed. Optimization will be for link clicks only.

**Full path**: Register your app, add the SDK, and set up App Events to optimize for installs and track conversions.

---

## Part 1: Minimal Setup (Run Ads Now)

### Step 1: Create or Access Meta Business Manager

1. Go to [business.facebook.com](https://business.facebook.com)
2. Create a Business Manager account if you don't have one
3. Add your **Ad Account** (or create one)
4. Create or connect a **Facebook Page** (required for ads)

### Step 2: Create an App Promotion Campaign

1. Go to [Ads Manager](https://www.facebook.com/adsmanager/)
2. Click **Create**
3. Select objective: **App promotion**
4. Campaign name: e.g. `Chosen - App Install`
5. Under **App**, you have two options:
   - **Paste your App Store URL** – Use `https://www.theappdad.com/chosen` (redirects to App Store; Facebook accepts your domain)
   - **Select a registered app** – Skip for now if you haven’t registered

### Step 3: Set Up Ad Set & Ad

1. **Ad set**: Choose audience, budget, placement
2. **Ad creative**: Add headline, description, image/video
3. **Destination**: App Store (or your redirect URL)
4. Launch the campaign

**Note**: Without app registration, ads optimize for **link clicks** only. You won’t see install-level reporting.

---

## Part 2: Full Setup (Register App for Install Tracking)

### Step 1: Create a Meta Developer App

1. Go to [developers.facebook.com](https://developers.facebook.com/)
2. Log in with your Facebook account
3. Click **My Apps** → **Create App**
4. Choose **Business** (or **Consumer** if Business isn’t suitable)
5. Enter:
   - **App Name**: `Chosen`
   - **Contact email**: your email
   - **Business Account**: Select your Business Manager
6. Click **Create App**
7. Note your **App ID** (shown in dashboard)

### Step 2: Add iOS Platform

1. In your app dashboard, go to **Settings** → **Basic**
2. Add **App Domains**: `theappdad.com`, `www.theappdad.com`
3. Under **Add Platform**, click **iOS**
4. Enter:
   - **Bundle ID**: Your app’s bundle ID (e.g. `com.theappdad.chosen`)
   - **iPhone Store ID**: Your App Store ID – `6757462559` (from your App Store URL)
   - **iPad Store ID**: Same if it’s a universal app
5. Add **Privacy Policy URL**: `https://theappdad.github.io/Chosen-Right-App/` (or your main site privacy page)
6. Save

### Step 3: Connect to Business Manager

1. Go to [business.facebook.com](https://business.facebook.com) → **Business Settings**
2. Under **Accounts** → **Apps**, click **Add** → **Add your own app**
3. Enter your **App ID** or select your app from the list
4. Assign yourself **Admin** access
5. Link your **Ad Account** (Settings → Ad Accounts → Add)

### Step 4: Add the Facebook SDK to Your iOS App (For Install Tracking)

1. In Xcode, add the Facebook SDK via Swift Package Manager or CocoaPods:
   - **SPM**: `https://github.com/facebook/facebook-ios-sdk`
   - **CocoaPods**: `pod 'FacebookCore'` and `pod 'FBSDKCoreKit'`
2. In `AppDelegate` (or `@main` App struct), add:
   ```swift
   import FBSDKCoreKit
   // In application(_:didFinishLaunchingWithOptions:):
   ApplicationDelegate.shared.application(application, didFinishLaunchingWithOptions: launchOptions)
   ```
3. Add to `Info.plist`:
   - `FacebookAppID`: your App ID
   - `FacebookDisplayName`: Chosen
4. Log the `fb_mobile_activate_app` event (automatic with SDK) and any purchase events you want to optimize for

**Reference**: [Facebook SDK for iOS](https://developers.facebook.com/docs/ios/getting-started)

### Step 5: Configure App Events (Optional but Recommended)

1. Go to [Events Manager](https://business.facebook.com/events_manager)
2. Select your app
3. Add **App Events** (via [Codeless setup](https://www.facebook.com/business/help/1634426896605026) or manual code)
4. Standard events to consider:
   - `fb_mobile_activate_app` (automatic with SDK)
   - `fb_mobile_complete_registration` (if you have sign-up)
   - `Purchase` (for in-app purchases)

### Step 6: Run App Install Campaigns with Optimization

1. In Ads Manager, create campaign with **App promotion** objective
2. Select your **registered app** (Chosen)
3. Choose optimization:
   - **App installs** – optimize for installs
   - **App events** – optimize for purchases or other events (after SDK + events are set up)
4. Create your ad and launch

---

## Part 3: Campaign Objectives Quick Reference

| Objective | Use Case | App Registration Required? |
|-----------|----------|----------------------------|
| **App promotion** | Get installs | No (link clicks only); Yes (for install optimization) |
| **Traffic** | Send people to website/App Store | No – use `https://www.theappdad.com/chosen` |
| **Sales / Conversions** | Optimize for in-app purchases | Yes – requires SDK + Purchase event |

---

## Part 4: Useful Links

- [About App Ads](https://www.facebook.com/business/help/1471413626484885) – Meta Business Help
- [App Ads Overview](https://developers.facebook.com/docs/app-ads/overview) – Components & tools
- [Get Started](https://developers.facebook.com/docs/app-ads/get-started/) – Events & optimization
- [Facebook SDK for iOS](https://developers.facebook.com/docs/ios/getting-started)
- [App Events for iOS](https://developers.facebook.com/docs/app-events/getting-started-app-events-ios/)
- [Advantage+ App Campaigns](https://www.facebook.com/business/help/309994246788275) – AI-powered app campaigns

---

## iOS 14.5+ Considerations

If targeting users on iOS 14.5+, review [Account and campaign considerations for iOS 14.5+](https://www.facebook.com/business/help/651033805513936). You may need to:

- Configure [Aggregated Event Measurement](https://www.facebook.com/business/help/331612538028890)
- Prioritize events in Events Manager
- Understand SKAdNetwork limitations for attribution

---

*Guide created for The App Dad / Chosen. Update as Meta’s products change.*
