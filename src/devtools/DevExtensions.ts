import { registerDevMenuItems } from "expo-dev-menu"
import { router } from "expo-router"

import { storage } from "src/utils/storage"

const resetNavigation = () => {
  router.replace("/")
}

const devMenuitems = [
  {
    name: "Developer Tools",
    callback: () => {
      router.push("/devTools")
    },
  },
  {
    name: "Reset MMKV Storage",
    callback: () => {
      storage.clearAll()
      resetNavigation()
    },
  },
  {
    name: "Reset Navigation",
    callback: () => {
      resetNavigation()
    },
  },
]

registerDevMenuItems(devMenuitems)
