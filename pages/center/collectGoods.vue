<template>
	<view class="wrap">
		<view class="collectList u-p-10">
			<view @click='jump(goods.goods_id)' class="goodsBox u-flex u-p-10 u-m-t-20 u-m-b-20" v-for="goods in collectList" :key="goods.id">
				<view class="u-flex-3 u-border">
					<u-image width="100%" height="200" border-radius="20" :src="goods.goods.cover_url"></u-image>
				</view>
				<view class="u-flex baseInfo u-row-between u-flex-9 u-col-top">
					<text class="title u-font-32">{{goods.goods.title}}</text>
					<text class="price">￥{{goods.goods.price}}</text>
					<text class="small">与:{{goods.created_at}}收藏</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				collectList:[]
			}
		},
		async onLoad(){
			const {data} = await this.$u.api.getCollect()
			this.collectList=data
		},
		methods: {
			// 商品详情路由跳转
			jump(id){
				this.$u.route({
					url:'/pages/goods/show',
					params:{id}
				})
			},
		}
	}
</script>

<style scoped lang="scss">
	.collectList{
		.goodsBox{
			box-shadow: 0 0 5rpx 6rpx rgba($color: #ccc, $alpha: 0.3);
			.baseInfo{
				height: 200rpx;
				flex-direction: column;
				.title{
					font-weight: 550;
				}
				.price{
					color: red;
				}
			}
		}
	}
</style>
