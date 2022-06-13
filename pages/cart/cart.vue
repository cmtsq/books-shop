<template>
	<view class="wrap">
		<template v-if="vuex_token">
			<view v-if="goodsList.length" class="cartGoodsList u-p-b-80">
				<view class="cartGoods u-flex u-p-15" v-for="goods in goodsList" :key="goods.id">
					<view>
						<u-checkbox v-model="goods.is_checked?true:false" :name="goods.id" @change="checkGoods" size="40" shape="circle"></u-checkbox>
					</view>
					<view class="goodsInfo u-flex u-p-10">
						<view @click='jump(`/pages/goods/goods-detail/goods-detail`,goods.goods_id)'>
							<u-image border-radius="15" width="200rpx" height="200rpx" :src="goods.goods.cover_url">
							</u-image>
						</view>
						<view class="goodsBaseInfo u-flex u-row-between u-col-top u-p-10">
							<view class="priceNum" @click='jump(`/pages/goods/goods-detail/goods-detail`,goods.goods_id)'>
								<text class="title u-p-l-10 u-font-32">{{goods.goods.title}}</text>
								<br>
								<text class="small">{{goods.goods.description}}</text>
								<view class="u-text-right small">
									库存:<text style="color:red">{{goods.goods.stock}}</text>
								</view>
							</view>
							<view class="priceNum u-flex u-row-between">
								<text class="price u-font-34">￥{{goods.goods.price}}</text>
								<u-number-box v-model="goods.num" :min="1" :max="goods.goods.stock" :index="goods.id"
									@change="numChange"></u-number-box>
								<u-icon @click="removeGoods(goods.id)" name="trash" color="#e83333" size="36">
								</u-icon>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="empty" v-else>
				<u-empty text="购物车空空如也" mode="car"></u-empty>
			</view>
			<view class="bottomFixed u-flex u-p-15">
				<view class="u-flex-5">
					<u-checkbox v-model="allCheck" size="40" shape="circle">全选</u-checkbox>
				</view>
				<view class="u-flex u-flex-7 u-row-around">
					<view>
						<text class="title">合计:</text>
						<text class="price">￥{{total}}</text>
					</view>
					<u-button type="primary" :ripple="true" shape="square" disabled>去结算</u-button>
				</view>
			</view>
		</template>
		<template v-else>
			<u-empty text="暂未登入" mode="permission"></u-empty>
		</template>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				goodsList:[]
			}
		},
		onShow(){
			if(this.vuex_token){
				this.getCartGoods()
			}
		},
		computed:{
			//全选和全不选判断
			allCheck:{
				get(){
					return this.goodsList.every((goods)=>{
						return goods.is_checked
					})
				},
				set(val){
					this.checkAll(val)
				}
			},
			//选中商品的总价
			total(){
				return this.goodsList.filter((goods)=>{
					//过滤掉没有选中的商品
					if(goods.is_checked){
						return true
					}
				}).reduce((pre,goods)=>{
					return parseInt(pre) + parseInt(goods.goods.price) * goods.num
				}, 0)
			}
		},
		methods: {
			//获得购物车商品
			async getCartGoods(){
				const {data} = await this.$u.api.cartList()
				this.goodsList = data
				// console.log(data)
				// console.log(this.goodsList)
			},
			//单个商品选中/不选中
			async checkGoods(val){
				const {value,name} = val
				console.log(value)
				let arr = []
				this.goodsList.forEach((goods)=>{
					if(goods.is_checked){
						arr.push(goods.id)
					}
				})
				if(!value){
					//选中状态，点击后变成false
					arr.splice(arr.indexOf(name),1)
					await this.$u.api.isCheck(arr)
				}else{
					//没选中的状态，点击后变成true
					arr.push(name)
					await this.$u.api.isCheck(arr)
				}
				//最后重新调用获取商品数据更新
				this.getCartGoods()
			},
			//全选与全不选接口调用
			async checkAll(val){
				let arr = []
				if(!val){
					//全选点击(变全不选)
					arr = []
					await this.$u.api.isCheck(arr)
				}else{
					//全不选点击
					this.goodsList.forEach((goods)=>{
						arr.push(goods.id)
					})
					await this.$u.api.isCheck(arr)
				}
				//最后重新调用获取商品数据更新
				this.getCartGoods()
			},
			//商品数量改变
			async numChange(val){
				const {value,index} = val
				await this.$u.api.num(index, String(value))
			},
			//移除商品
			async removeGoods(id){
				await this.$u.api.delCartGoods(id)
				this.$u.toast("商品移除成功")
				this.getCartGoods()
			}
		}
	}
</script>

<style scoped lang="scss">
	.wrap {
		min-height: 80vh;
		.empty {
			height: 80vh;
		}
	
		.loading {
			text-align: center;
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
		}
	
		.title,
		.price {
			font-weight: 800;
		}
	
		.price {
			color: #e83333;
		}
	
		.cartGoodsList {
			.cartGoods {
				.goodsInfo {
					width: 100%;
					background-color: rgb(251, 250, 251);
	
					.goodsBaseInfo {
						width: 100%;
						height: 200rpx;
						flex-direction: column;
	
						.priceNum {
							width: 100%;
	
						}
					}
				}
			}
		}
	
		.bottomFixed {
			position: fixed;
			left: 0;
			right: 0;
			background-color: #fff;
		}
	
		/*#ifdef H5*/
		.bottomFixed {
			bottom: 100rpx;
		}
	
		/*#endif*/
		/*#ifdef MP-WEIXIN*/
		.bottomFixed {
			bottom: 0;
			z-index: 99999;
		}
	
		/*#endif*/
	
	}
</style>
