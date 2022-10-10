// @ts-nocheck
import React, { useEffect, useState } from 'react'
import * as rssParser from 'react-native-rss-parser';

export let alToken = localStorage.getItem('ALtoken') || null
const defaults = {
  playerAutoplay: true,
  playerPause: true,
  playerAutocomplete: true,
  rssQuality: '1080',
  rssFeed: 'SubsPlease',
  rssAutoplay: true,
  rssTrusted: true,
  rssBatch: false,
  torrentSpeed: 10,
  torrentPersist: false,
  torrentDHT: false,
  torrentPeX: false
}
localStorage.removeItem('relations') // TODO: remove
export let set = JSON.parse(localStorage.getItem('settings')) || { ...defaults }
window.IPC.on('path', data => {
  set.torrentPath = data
})
window.addEventListener('paste', ({ clipboardData }) => {
  if (clipboardData.items?.[0]) {
    if (clipboardData.items[0].type === 'text/plain' && clipboardData.items[0].kind === 'string') {
      clipboardData.items[0].getAsString(text => {
        let token = text.split('access_token=')?.[1]?.split('&token_type')?.[0]
        if (token) {
          if (token.endsWith('/')) token = token.slice(0, -1)
          handleToken(token)
        }
      })
    }
  }
})
window.IPC.on('altoken', handleToken)
function handleToken(data) {
  localStorage.setItem('ALtoken', data)
  alToken = data
  location.reload()
}
export const platformMap = {
  aix: 'Aix',
  darwin: 'MacOS',
  freebsd: 'Linux',
  linux: 'Linux',
  openbsd: 'Linux',
  sunos: 'SunOS',
  win32: 'Windows'
}
let version = '1.0.0'
window.IPC.on('version', data => (version = data))
window.IPC.emit('version')

function Settings() {

  // const groups = {
  //   player: {
  //     name: 'Player',
  //     icon: 'play_arrow',
  //     desc: 'Player configuration, playback behavior, and other.'
  //   },
  //   rss: {
  //     name: 'RSS',
  //     icon: 'rss_feed',
  //     desc: 'RSS configuration, URLs, quality, and options.'
  //   },
  //   torrent: {
  //     name: 'Torrent',
  //     icon: 'hub',
  //     desc: 'Torrent client settings, and preferences.'
  //   }
  // }
  // let settings = set
  // $: saveSettings(settings)
  // function saveSettings() {
  //   localStorage.setItem('settings', JSON.stringify(settings))
  // }
  // function restoreSettings() {
  //   localStorage.removeItem('settings')
  //   settings = { ...defaults }
  // }
  // function handleFolder() {
  //   window.IPC.emit('dialog')
  // }

  return (
    <>
      <div style={{ height: "40%", width: "100%", textAlign: "center" }}>
        <p style={{ paddingTop: "8%", fontSize: 75 }}>Library</p>
      </div>
    </>
  )
}

export default Settings