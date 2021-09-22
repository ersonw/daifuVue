<template>
  <div class="navbar">
    <hamburger id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />
    <audio
      ref="audioIn"
      class="dn"
      :src="urlIn"
      :preload="audio.preload"
      @play="onPlay"
      @waiting="onWaiting"
    />
    <audio
      ref="audioOut"
      class="dn"
      :src="urlOut"
      :preload="audio.preload"
      @play="onPlay"
      @waiting="onWaiting"
    />
    <div class="right-menu">
      <template v-if="device!=='mobile'">
        <error-log class="errLog-container right-menu-item hover-effect" />
        <el-tooltip content="Global Size" effect="dark" placement="bottom">
          <size-select id="size-select" class="right-menu-item hover-effect" />
        </el-tooltip>

      </template>

      <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
        <div class="avatar-wrapper">
          <img :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar">
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/telebot/list">
            <el-dropdown-item>入款消息({{ newInMessageCount }})</el-dropdown-item>
          </router-link>
          <router-link to="/telebot/out">
            <el-dropdown-item>下发消息({{ newOutMessageCount }})</el-dropdown-item>
          </router-link>
          <el-dropdown-item divided @click.native="logout">
            <span style="display:block;">退出登陆</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import ErrorLog from '@/components/ErrorLog'
// import Screenfull from '@/components/Screenfull'
import SizeSelect from '@/components/SizeSelect'
// import Search from '@/components/HeaderSearch'

export default {
  components: {
    Breadcrumb,
    Hamburger,
    ErrorLog,
    SizeSelect
  },
  data() {
    return {
      urlIn: '/mp3/eeaf688a8f4b9f29ff3e50efc1738b67.mp3',
      urlOut: '/mp3/7d7b75393ccd9bada73f0c9ca65ed6b2.mp3',
      server: { access: 0 },
      ws: [],
      wsIndex: 0,
      webSock: null,
      inMessage: new Map(),
      outMessage: new Map(),
      newInMessageCount: 0,
      newOutMessageCount: 0,
      sliderTime: 0,
      audio: {
        currentTime: 0,
        maxTime: 0,
        playing: false,
        muted: false,
        speed: 1,
        waiting: true,
        preload: 'auto',
        controlList: {
          onlyOnePlaying: true
        }
      }
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'device',
      'token'
    ])
  },
  created() {
    const url = (window.location.href).split('://')
    if (url[0] === 'http') {
      this.ws.push({ value: `ws://${window.location.host}/websocket` })
    } else {
      this.ws.push({ value: `wss://${window.location.host}/websocket` })
    }
    this.initWebSocket()
  },
  methods: {
    onWaiting(res) {
      console.log(res)
    },
    onPlay(res) {
      console.log(res)
      this.audio.playing = true
      this.audio.loading = false
      if (!this.controlList.onlyOnePlaying) {
        return
      }
      const target = res.target
      const audios = document.getElementsByTagName('audio');
      [...audios].forEach((item) => {
        if (item !== target) {
          item.pause()
        }
      })
    },
    toggleSideBar() {
      // this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
    initWebSocket() {
      const wsUri = `${this.ws[this.wsIndex].value}`
      this.webSock = new WebSocket(wsUri)
      this.webSock.onmessage = this.websocketOnmessage
      this.webSock.onopen = this.websocketOnopen
      this.webSock.onerror = this.websocketOnerror
      this.webSock.onclose = this.websocketClose
    },
    websocketOnopen() {
      const actions = { token: this.token, action: 'auth' }
      this.websocketSend(JSON.stringify(actions))
    },
    websocketOnerror() {
      if (this.wsIndex < this.ws.length) {
        this.wsIndex++
      } else {
        this.wsIndex = 0
      }
      this.initWebSocket()
    },
    websocketOnmessage(e) {
      const redata = JSON.parse(e.data)
      switch (redata.action) {
        case 'auth':
          if (redata.response === false) {
            alert('消息系统验证失败，请刷新界面或者联系管理员！')
          } else {
            this.websocketSend(JSON.stringify({ action: 'getMessage' }))
          }
          break
        case 'getMessage':
          this.getMessage(redata.data)
          break
      }
    },
    websocketSend(Data) {
      this.webSock.send(Data)
    },
    websocketClose(e) {
      this.dialogFormVisible = false
    },
    getMessage(data) {
      // console.log(data)
      if (data.inMessage[0] !== undefined) {
        this.handlerInMessage(data.inMessage)
      }
      if (data.outMessage[0] !== undefined) {
        this.handlerOutMessage(data.outMessage)
      }
      this.newOutMessageCount = data.outMessage.length
      this.newInMessageCount = data.inMessage.length
    },
    handlerInMessage(data) {
      let t = false
      for (const v of data) {
        if (!this.inMessage.has(v.id)) {
          t = true
        }
        this.inMessage.set(v.id, v)
      }
      if (t) {
        // document.getElementsByTagName('audio')[0].play()
        this.$refs.audioIn.play()
      }
      for (const v of this.inMessage) {
        t = false
        for (const vv of data) {
          if (v[0] === vv.id) {
            t = true
          }
        }
        if (t === false) {
          this.inMessage.delete(v[0])
        }
      }
    },
    handlerOutMessage(data) {
      let t = false
      for (const v of data) {
        if (!this.outMessage.has(v.id)) {
          t = true
        }
        this.outMessage.set(v.id, v)
      }
      if (t) {
        // document.getElementsByTagName('audio')[1].play()
        this.$refs.audioOut.play()
      }
      for (const v of this.outMessage) {
        t = false
        for (const vv of data) {
          if (v[0] === vv.id) {
            t = true
          }
        }
        if (t === false) {
          this.outMessage.delete(v[0])
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
