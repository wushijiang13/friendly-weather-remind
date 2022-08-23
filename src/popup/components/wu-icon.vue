<template>
 <WuIcon :type="icon" class="wu-icon"/>
</template>


<script>
import { createFromIconfontCN } from '@ant-design/icons-vue';
// import { defineComponent } from 'vue';

//现在这里加载不出来是因为策略同源的问题，回头需要找文档设置一下就好了。
const WuIcon = createFromIconfontCN({
  scriptUrl: './iconfont.js', // 在 iconfont.cn 上生成
});

export default {
  props:['icon'],
  components:{
    WuIcon
  }
};
</script>
<style scoped>
.icons-list :deep(.anticon) {
  margin-right: 6px;
  font-size: 24px;
}
</style>