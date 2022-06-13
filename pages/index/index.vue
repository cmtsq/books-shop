<template>
	<view>
		<u-swiper :list="slides" name="img_url" height="320"></u-swiper>
		<view>
			<u-tabs :list="sortlist" :current="currentSort" :is-scroll="false" @change="sortChange" bar-width="100"
				item-width="160"></u-tabs>
		</view>

		<u-row gutter="16" class="u-skeleton">
			<u-col span="6" v-for="item,index in goodsList" :key="index">
				<goods-card :goods="item"></goods-card>
			</u-col>
		</u-row>

		<!--骨架屏-->
		<u-skeleton :loading="loading" :animation="true" bgColor="#FFF"></u-skeleton>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				imgList: [],
				sortlist: [{
					name: '默认'
				}, {
					name: '销量'
				}, {
					name: '推荐',
				}, {
					name: '最新'
				}],
				currentSort: 0,
				slides: [],
				goodsList: [{},{},{},{}],
				page: 1,
				loading: false,
				goodsId: null
			}
		},
		//异步渲染数据
		async onLoad() {
			this.getData()
		},
		methods: {
			sortChange(index) {
				this.currentSort = index
				//重置数据和分页
				this.goodsList = [{},{},{},{}]
				this.page = 1
				//判断筛选条件
				this.getData()
			},
			//获取数据
			async getData() {
				this.loading = true //显示骨架屏


				const params = {
					page: this.page
				}
				//增加排序条件
				if (this.currentSort == 1) params.slaes = 1
				if (this.currentSort == 2) params.recommend = 1
				if (this.currentSort == 3) params.new = 1
				const res = await this.$u.api.index(params)
				this.loading = false //隐藏骨架屏
				this.slides = res.slides
				this.goodsList = this.goodsList.pop().title ? [...this.goodsList, ...res.goods.data]:res.goods.data
			}
		},
		onReachBottom() {
			// 重新请求数据，带上分页参数
			this.page = this.page + 1
			this.getData()
		}
	}
</script>

<style lang="scss" scpoed>

</style>
