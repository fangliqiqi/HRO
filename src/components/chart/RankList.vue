<template>
  <div class="rank">
    <h4 class="title">{{ title }}</h4>

    <ul
      class="list"
      :style="{height:height?`${height}px`:'auto',overflow:'auto'}"
    >
      <li
        :key="index"
        v-for="(item, index) in list"
        style="display:flex;"
      >
        <span
          :class="index < 3 ? 'active' : null"
          style="overflow: hidden"
        >{{ index + 1 }}</span>
        <a-tooltip
          placement="topLeft"
          :title="item.name"
        >
          <span style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;display: inline-block;width: 300px;">{{ item.name }}</span>
        </a-tooltip>
        <span style="margin:0px 8px 0px 5px">{{ item.total }}</span>
      </li>
    </ul>

  </div>
</template>

<script>
  export default {
    name: "RankList",
    // ['title', 'list']
    props: {
      title: {
        type: String,
        default: ''
      },
      list: {
        type: Array,
        default: null
      },
      height: {
        type: Number,
        default: null
      }
    }
  }
</script>

<style lang="scss" scoped>
.rank {
  padding: 0 32px 32px 72px;

  .list {
    margin: 25px 0 0;
    padding: 0;
    list-style: none;

    li {
      margin-top: 16px;

      span {
        color: rgba(0, 0, 0, 0.65);
        font-size: 14px;
        line-height: 22px;

        &:first-child {
          background-color: #f5f5f5;
          border-radius: 20px;
          display: inline-block;
          font-size: 12px;
          font-weight: 600;
          margin-right: 10px;
          height: 20px;
          line-height: 20px;
          width: 36px;
          text-align: center;
        }
        &.active {
          background-color: #314659;
          color: #fff;
        }
        &:last-child {
          float: right;
        }
      }
    }
  }
}

.mobile .rank {
  padding: 0 32px 32px 32px;
}
</style>