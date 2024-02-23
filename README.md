## Devkit

> A kit of local-only utilities~

### Apps

Devkit has two versions of the app both based upon the same source code.

#### Web App

It has a web app that's hosted at https://devkit.lgbt.
This is hosted via GitHub Pages and will **NEVER** make _any_ external requests.

#### Native App

We currently build versions of the app for:

- Linux (`deb`)
- Windows (`exe` and `msi`)
- MacOS (`dmg`)

**NOTE: Currently there's an issue with AppImage hence why we don't support it (see [#1](/issues/1))**

### FAQ

#### How is data stored?

All data created in the app is stored in [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API).

You can view your data either via the "View Data" page or in the devtools under "Applications" (for Chromium-based browsers) or "Storage" (for any other browser).

#### Do you plan on supporting any other storage methods?

Yes! The native app opens up numerous possibilities for other methods of storing data. As such we've built our app in such a way to make it plug and play with other storage methods.

This will _eventually_ be a setting users can tweak.
