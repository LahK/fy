// miniprogram/pages/editor/index.js
const STATUS = {
  READY: 'READY',
  RECORDING: 'RECORDING',
  PLAYING: 'PLAYING',
  DONE: 'DONE',
}

const MAIN_BUTTON = {
  [STATUS.READY]: {
    title: '开始录制',
    image: '../../assets/images/microphone.png',
  },
  [STATUS.RECORDING]: {
    title: '结束录制',
    image: '../../assets/images/stop.png',
  },
  [STATUS.PLAYING]: {
    title: '停止播放',
    image: '../../assets/images/stop.png',
  },
  [STATUS.DONE]: {
    title: '播放录音',
    image: '../../assets/images/play.png',
  },
}

Page({

  /**
   * Page initial data
   */
  data: {
    status: STATUS.READY,
    mainButton: MAIN_BUTTON[STATUS.READY],
    tempFilePath: '',
    recordingLength: 0,
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    this.initRecorder()
    this.initPlayer()
  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {

  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function () {

  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function () {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload: function () {
    this.stopRecordingLengthCounter()
  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh: function () {

  },

  /**
   * Called when page reach bottom
   */
  onReachBottom: function () {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function () {

  },

  initRecorder: function() {
    const rm = wx.getRecorderManager()

    rm.onStart(() => {
      console.log('on start')
    })

    rm.onStop(this.recorderOnStop)

    rm.onFrameRecorded((res) => {
      console.log('on frame recoreded')
      console.log(res)
    })

    rm.onError(this.handleError)

    // TODO: handle error
  },
  initPlayer: function() {
    const am = wx.getBackgroundAudioManager()

    am.onStop(this.onPlayerEnded)

    am.onEnded(this.onPlayerEnded)

    am.onError(this.handleError)

    // TODO: handle error
  },
  handleError: function () {
    this.updateRecorderStatus(STATUS.READY)
    this.stopRecordingLengthCounter()

    wx.showToast({
      title: '出错了，请重试。',
    })
  },

  recorderStart: function() {
    this.updateRecorderStatus(STATUS.RECORDING)

    const rm = wx.getRecorderManager()
    
    rm.start({
      duration: 3600000,//指定录音的时长，单位 ms
      sampleRate: 16000,//采样率
      numberOfChannels: 1,//录音通道数
      encodeBitRate: 96000,//编码码率
      format: 'mp3',//音频格式，有效值 aac/mp3
      frameSize: 50,//指定帧大小，单位 KB
    })

    this.startRecordingLengthCounter()
  },
  recorderStop: function () {
    const rm = wx.getRecorderManager()

    rm.stop()
  },
  recorderOnStop: function ({ tempFilePath }) {
    this.stopRecordingLengthCounter()

    this.setData({
      tempFilePath,
    })

    // wx.cloud.uploadFile({
    //   cloudPath: 'test.mp3',
    //   filePath: tempFilePath,
    //   success: res => {
    //     console.log('上传成功', res)
    //   },
    // })

    this.updateRecorderStatus(STATUS.DONE)
  },
  recorderReset: function () {
    this.updateRecorderStatus(STATUS.READY)
    this.setData({
      recordingLength: 0,
    })
  },

  startRecordingLengthCounter: function () {
    this.interval = setInterval(() => {
      this.setData({
        recordingLength: this.data.recordingLength + 1,
      })
    }, 1000)
  },
  stopRecordingLengthCounter: function () {
    if (this.interval) {
      clearInterval(this.interval)
      this.interval = undefined
    }
  },

  updateRecorderStatus: function (status) {
    if (!Object.values(STATUS).includes(status)) {
      throw new Error('Unknow recorder status.')
    }

    this.setData({
      status,
      mainButton: MAIN_BUTTON[status],
    })
  },

  replay: function () {
    this.updateRecorderStatus(STATUS.PLAYING)

    const am = wx.getBackgroundAudioManager()
    am.title="新录音"
    am.src = this.data.tempFilePath
  },
  stopReplay: function () {
    const am = wx.getBackgroundAudioManager()
    am.stop()
  },
  onPlayerEnded: function () {
    wx.showToast({
      title: 'ended',
    })
    this.updateRecorderStatus(STATUS.DONE)
  },

  onPressMainButton: function () {
    switch (this.data.status) {
      case STATUS.READY: 
        this.recorderStart()
        break
      case STATUS.RECORDING:
        this.recorderStop()
        break
      case STATUS.DONE:
        this.replay()
        break
      case STATUS.PLAYING:
        this.stopReplay()
        break
      default:
        return
    }
  },
  onPressReset: function () {
    this.recorderReset()
  },
  onPressSave: function () {

  },
})