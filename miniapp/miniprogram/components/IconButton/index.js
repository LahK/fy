// components/Button/index.js
Component({
  /**
   * Component properties
   */
  properties: {
    image: {
      type: String,
      value: '',
    },
    title: {
      type: String,
      value: '',
    },
    size: {
      type: Number,
      value: 24,
    },
    disabled: {
      type: Boolean,
      value: false,
    },
    hideTitle: {
      type: Boolean,
      value: false,
    },
    shadow: {
      type: Boolean,
      value: false,
    },
  },

  /**
   * Component initial data
   */
  data: {

  },

  /**
   * Component methods
   */
  methods: {
    onTap: function () {
      if (this.properties.disabled) {
        return
      }
      this.triggerEvent('ontap')
    },
  },
})
