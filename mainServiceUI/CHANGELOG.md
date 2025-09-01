# Changelog

---

## [2025-06-02] – [2025-06-07] — Initial Update After First Push

### TopBar
- Integrated the `TopBar` component, including the barcode (QR) icon, search bar, and profile icon.

### ServiceGrid
- Added 8 service icons representing different business features (e.g., Transport, Food, Mart, etc.).
- Implemented support for `item.icon` to render each service image.
- Integrated optional `tag` (e.g., SALE) overlay for selected services.

#### Changes
- Added `export default` function and styled the container for layout.
- Fixed the "Unmatched Route" error when opening the app in Expo Go by correctly exporting a functional component.
- Added 8 business icons (e.g., Transport, Food, Mart, etc.) displayed beneath the TopBar.

### Learned
- The importance of using `export default` to properly expose a component.
- Ensured file naming and exports are correctly handled for routing in Expo Router.
- Removed white backgrounds from icon images for a cleaner appearance inside the icon wrapper.
- Dynamically overlaid tags (e.g., SALE) on icons to highlight specific promotions or events.
---

## [2025-06-09] – [2025-06-15]

### App Structure Comparison
- `LoginUI` uses traditional React Native with manual navigation via `App.tsx` and Stack Navigator.
- `MainServiceUI` is built with Expo Router, leveraging file-based routing through `index.tsx`.

### index.tsx and ServiceGrid
- Implemented `bgLoaded` loading state in `index.tsx` to control screen rendering based on asset readiness.
- Added `onAllImagesLoaded` and `handleImageLoad` in `ServiceGrid` to track when all icons finish loading before showing the main UI.

### Learned
- `LoginUI` requires manual imports and route management in `App.tsx`, while `index.tsx` offers a simpler and cleaner structure with automatic routing.
- Expo Router provides a faster setup and is more scalable for multi-page applications compared to traditional React Native navigation.


## [2025-06-16] – [2025-06-21]

### index.tsx, TopBar, ServiceGrid

- Tried preloading icons using hidden `<Image>` tags.
- Used `isReady` state to control loading screen.
- Tested both `View` and `FlatList` for rendering icons.
- Implemented blinking circular placeholders for icons.
- All icons now appear at once after fully loaded.
- Fixed deadlock where images never triggered load events.

### Learned

- React Native doesn’t reliably load images off-screen.
- Preloading approach didn't work as expected — moving on to the next step.
- React Native must render `<Image>` to trigger `onLoadEnd`.
- Controlled placeholder animation using `Animated.loop`.

## [2025-06-23] – [2025-06-28]

### PaymentPanel

- Fixed loading issue by rendering icons in hidden view before `isReady`.
- Trying to use placeholderbox, boxwrapper to set the solid width

### Learned

- Using a hidden container tricks React Native into rendering.
- The size match issue becuase the icon, when no icon reduce size the flexible box

## [2025-07-08] – [2025-07-13]

### PaymentPanel

- The blinking loading boxes finally fixed to the same size layout, `renderBox` and then return
- The icons loading issue, try to change the`Image source, onLoad` in Hidden preload image to `Image.prefetch()` method.
- Replaced onLoadEnd to useState `BlinkingNone`

### Learned

- Reusable `renderBox` Function, rendering Payment and Points boxes, reducing repearted code.
- Need to find the method that rendering the icons and blinking at the same time.
- During blinking, redering the icons at the sametime, preload but hiding during blinking, opacity: 0

## [2025-07-15] – [2025-07-20]

### PaymentPanel

- Remove the icon bg and adjust the size

### PromoBanner

- Space issue, 8 icons in ServiceGrid missing 
- Try to using Scrollview in index.tsx to solve this issue
- Text view banner box in PromoBanner and adjust margin top

### Learned

- VirtuallizedLists never be nested inside plain ScrollViews, replace ScrollView with a FlatList using ListHeaderComponent

## [2025-07-21] – [2025-07-26]

### PromoBanner
- `Overlaycontent` put the text on the background, implemented the design for the real app
- Located the text on the top and the image down to the right corner, stying css
- Declair objects, id, image, title, card, text...return objects
- Added same method in the PaymentPanel, blinking container and `isloaded`, `useEffect`, `Animated.loop` if objectLoaded condition and return `Animated view` with the container, objectLoaded true?

### changed
- Added the banner with id 1 and 2, showing rotating each time the app opens, rotating banner system
- `useEffect`, handles lastindex and nextindex in `try, catch`.
- Added useState `inmage, icon Loaded` 

## [2025-07-28] – [2025-08-3]

### PromoBanner
- Image source, banner.Image in `AllAssetLoaded`, benner.title and subtitle

### Changed
- It's better but still the image and three icons appear late after finishing the blinking.

### Problem solved
- Added `useEffect` if statement, imageLoaded, setAllready true and adjust the image size time saving for loading.

### Learned banner promotion and algorithm
- Rotation and Scheduling Logic
- Personalization(User preferences, Location data, Purchase history, Machine learning)
- Event and Campaign Targeting(Chrismas, New Year)

### Algorithm(User preference)
```ts
// Determine most used service type from user preferences
const getMostUsedType = (preferences) => {
  const sorted = Object.entries(preferences).sort((a, b) => b[1] - a[1]);
  return sorted[0][0]; // returns the key with highest usage
};

// Example usage
const mockUserPreferences = {
  ride: 10,
  food: 3,
  shopping: 5,
};

const preferredType = getMostUsedType(mockUserPreferences); // 'ride'

// Select banner matching the preferred type
const preferredBanner = banners.find(b => b.type === preferredType);
```
### Recommendation Restaurant
- Balanced Layout between the image and title, vertical alignment

## [2025-08-5] – [2025-08-9]

### Discover  
- Added Discover things section, 3 images in orginal layout.

### Recommended restaurant

- Added arrowButton in `ListFooterComponent` icon to convert screen all the list of restaurant

## [2025-08-11] – [2025-08-16]

### Challenge box

- Added logo image, title subtitle something like that in the box, `container` and `card`.




