export const isVersionOutdated = (currentVersion: string, latestVersion: string) => {
  // The version is major.minor.patch, compare version against what the extension knows is the latest version
  // C# actually gives us a version with 4 numbers, but this just ignores the last one
  const [major, minor, patch] = latestVersion.split('.').map((v) => parseInt(v))
  const [major2, minor2, patch2] = currentVersion.split('.').map((v) => parseInt(v))
  if (major2 < major || (major2 === major && minor2 < minor) || (major2 === major && minor2 === minor && patch2 < patch))
    return true
  else
    return false
}

export type CustomAdapter = {
  port: number
  enabled: boolean
}

export type TSupportedSites = 'Apple Music' | 'Bandcamp' | 'Deezer' | 'Pandora' | 'Plex' | 'Soundcloud' | 'Spotify' | 'Tidal' | 'Twitch' | 'Youtube' | 'Youtube Embeds' | 'Youtube Music'
export const SupportedSites: TSupportedSites[] = ['Apple Music', 'Bandcamp', 'Deezer', 'Pandora', 'Plex', 'Soundcloud', 'Spotify', 'Tidal', 'Twitch', 'Youtube', 'Youtube Embeds', 'Youtube Music']

export type Settings = {
  updateFrequencyMs: number
  useGeneric: boolean
  useGenericList: boolean
  isListBlocked: boolean
  genericList: string[]
  customAdapters: CustomAdapter[]
  disabledBuiltInAdapters: string[]
  disabledSites: TSupportedSites[]
  useTelemetry: boolean
}

export const defaultSettings: Settings = {
  updateFrequencyMs: 50,
  useGeneric: false,
  useGenericList: false,
  isListBlocked: false,
  genericList: ['streamable.com', 'www.adultswim.com'],
  customAdapters: [],
  disabledBuiltInAdapters: [],
  disabledSites: [],
  useTelemetry: false
}

export type Adapter = {
  name: string,
  port: number,
  gh: string
}

export const BuiltInAdapters: Adapter[] = [
  {
    name: 'Rainmeter Adapter',
    port: 8974,
    gh: 'keifufu/WebNowPlaying-Redux-Rainmeter'
  }
]

export const sendEvent = (event: 'outdated' | 'wsConnected' | 'wsDisconnected' | 'getSettings' | 'saveSettings', settings?: Settings): Promise<any> => new Promise((resolve) => {
  if (!window?.chrome?.runtime?.id) {
    resolve(defaultSettings)
    return
  }
  chrome.runtime.sendMessage({ event, settings }, (response) => {
    resolve(response)
  })
})

export const getVersionFromGithub = async (gh: string) => {
  try {
    const releaseApiLink = `https://api.github.com/repos/${gh}/releases?per_page=1`
    const response = await fetch(releaseApiLink)
    if (response.ok) {
      const json = await response.json()
      let tag = json[0].tag_name
      if (!tag) return 'Error'
      if (tag.startsWith('v')) tag = tag.slice(1)
      return tag
    }
    return 'Error'
  } catch {
    return 'Error'
  }
}

export const getExtensionVersion = () => {
  if (typeof window.chrome?.runtime?.getManifest === 'function') return chrome.runtime.getManifest().version
  else return '0.0.0'
}