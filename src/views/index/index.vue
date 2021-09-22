<template>
  <div class="dashboard-container">
    <component :is="currentRole" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import adminIndex from './admin'
import editorIndex from './editor'

export default {
  name: 'Index',
  components: { adminIndex, editorIndex },
  data() {
    return {
      currentRole: 'adminIndex'
    }
  },
  computed: {
    ...mapGetters([
      'roles'
    ])
  },
  created() {
    if (!this.roles.includes('admin')) {
      this.currentRole = 'editorDashboard'
    }
  }
}
</script>
