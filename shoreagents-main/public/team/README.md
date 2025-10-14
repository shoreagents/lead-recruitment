# Team Images Setup

## Instructions for Adding Team Photos

### 1. Save Your Team Photos Here

Place all team member photos in this `/public/team/` folder with these naming conventions:

```
stephen-atcheler.jpg       (main photo)
stephen-atcheler-2.jpg     (hover photo)
charmine-salas.jpg         (main photo)
charmine-salas-2.jpg       (hover photo)
kath-macenas.jpg           (main photo)
kath-macenas-2.jpg         (hover photo)
...etc
```

### 2. Cool Hover Effect Feature! 🎉

**Dual Image System:**
- **Main Photo** (`name.jpg`) - Shows by default
- **Hover Photo** (`name-2.jpg`) - Shows on hover with cool transition
- **Fun Effects**: Scale, fade, shadow glow, and overlay animations

### 3. Recommended Image Specifications

- **Format**: JPG, PNG, or WebP
- **Size**: 400x400px minimum (square aspect ratio)
- **File Size**: Under 500KB each
- **Quality**: High resolution for professional appearance
- **Hover Photos**: Can be more casual/fun shots for personality!

### 3. Next.js Image Optimization

The site automatically:
- ✅ Converts to WebP format for faster loading
- ✅ Creates multiple sizes for different devices
- ✅ Adds lazy loading for better performance
- ✅ Provides blur placeholder while loading

### 4. Different File Types & Sizes

Don't worry about different file types or sizes! Next.js handles:
- **JPG, PNG, WebP** - All supported
- **Different dimensions** - Automatically cropped to square
- **Large file sizes** - Automatically optimized

### 5. Updating Team Data

After adding photos, update the team member data in:
```
/src/app/our-team/page.tsx
```

Change the `image` property from `/team/placeholder-avatar.jpg` to your actual photo path:

```tsx
<TeamMember
  name="Actual Name"
  title="Actual Position"
  image="/team/actual-photo.jpg"  // ← Update this
  // ... other props
/>
```

### 6. Placeholder Avatar

If you don't have a photo yet, the system will use a default avatar placeholder until you add the actual photo.

---

## Ready to Upload?

1. Drop your team photos in this folder
2. Update the team member data in the page
3. Refresh the site to see your team!

The system will automatically optimize everything for web performance! 🚀
