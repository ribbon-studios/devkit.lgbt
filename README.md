## Devkit

> A kit of local-only utilities~

### Apps

Devkit has two versions of the app both based upon the same source code, but with slightly different release cadences.

#### Web App

It has a web app that's hosted at https://devkit.lgbt.
This is hosted via GitHub Pages and will **NEVER** make _any_ external requests.

Releases occur every time a change is made to the **main** branch of the repo.

#### Native App

See [Releases](https://github.com/rain-cafe/devkit.lgbt/releases/latest)!

Releases occur every time a tag is pushed to the repo.

**We currently build versions of the app for:**

- Linux (`deb` and `AppImage`)
- Windows (`exe` and `msi`)
- MacOS (`dmg`)

```sh
chmod u+x ./devkit_<version>_amd64.AppImage
```

### FAQ

#### How is data stored?

All data created in the app is stored in [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API).

You can view your data either via the "View Data" page or in the devtools under "Applications" (for Chromium-based browsers) or "Storage" (for any other browser).

#### Do you plan on supporting any other storage methods?

Yes! The native app opens up numerous possibilities for other methods of storing data. As such we've built our app in such a way to make it plug and play with other storage methods.

This will _eventually_ be a setting users can tweak.
