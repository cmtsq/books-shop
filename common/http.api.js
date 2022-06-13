const install = (Vue,vm) => {
	//定义 api 属性
	vm.$u.api = {}
	
	//首页
	vm.$u.api.index = (params ={}) => vm.$u.get('./api/index',params)
	
	//认证相关的
	vm.$u.api.authLogin = params => vm.$u.post('./api/auth/login',params)//登录
	vm.$u.api.authRegister = params => vm.$u.post('./api/auth/register',params)//注册
	vm.$u.api.authLogout = () => vm.$u.post('./api/auth/logout')//退出登录
	vm.$u.api.authOssToken = () => vm.$u.get('./api/auth/oss/token')//获取OSStoken
	
	
	// 用户相关的
	vm.$u.api.userInfo = ()=>vm.$u.get('/api/user')//用户详情
	vm.$u.api.userInfoUpdate = params=>vm.$u.put('/api/user',params)//修改用户信息
	vm.$u.api.userAvatar = params=>vm.$u.post('/api/user/avatar',params)//修改用户信息
	
	
	//商品相关的
	vm.$u.api.goodsInfo = id =>vm.$u.get(`/api/goods/${id}`)//商品详情
	vm.$u.api.goodsCollect = id =>vm.$u.post(`/api/collects/goods/${id}`)//商品收藏
	vm.$u.api.goodsList = (params = {}) =>vm.$u.get('/api/goods',params)//商品分类
	vm.$u.api.getCollect = () =>vm.$u.get('/api/collects')//商品收藏列表
	
	
	//购物车相关
	vm.$u.api.cartAdd = params =>vm.$u.post('/api/carts',params)//加入购物车
	vm.$u.api.cartList = () =>vm.$u.get('/api/carts?include=goods')//购物车商品列表
	vm.$u.api.num = (cart,num) =>vm.$u.put(`/api/carts/${cart}`,{num});//购物车商品数量改变
	vm.$u.api.delCartGoods = cart =>vm.$u.delete(`/api/carts/${cart}`);//移除商品
	vm.$u.api.isCheck = cart_ids =>vm.$u.patch(`/api/carts/checked`,{cart_ids});//移除商品
	
	
	//订单相关的
	
	
	
	//将各个定义的接口，名称，统一放进对象挂载到vm。$u.api(因为vm就是this. 也即this.$u.api)下
	// vm.$u.api={
	// 	index,
	// 	authLogin
	// };
}

export default {
	install
}