<template>
	<view>
		<u-upload ref="upload" :action="action" :max-size="5 * 1024 * 1024" max-count="1" :before-upload="beforeUpload" :custom-btn='true' :form-data="formData" :multiple='false' :deletable='false' :show-progress="false" width="0" height="0" @on-success="onSuccess">
			<u-avatar slot="addBtn" :src="vuex_user.avatar_url" size="140"></u-avatar>
		</u-upload>
	</view>
</template>

<script>
	let that = {}
	export default {
		name: "oss-upload",
		data() {
			return {
				action: 'http://www.example.com/upload',
				formData:{},
				upFileName:''
			};
		},
		created(){
			that = this
		},
		methods: {
			//上传前的钩子
			//注意：在小程序中 this 可能会丢失 可在外面定义一个that变量，到里面将this赋值给that
			async beforeUpload(index, list) {
				const {file} = list[0]
				// #ifdef H5
				const fileName = file.name
				// #endif
				// #ifndef H5
				const fileName = file.path
				// #endif
				//请求API,获取oss token
				const ossToken = await this.$u.api.authOssToken()
				// console.log(ossToken)
				//设置上传地址
				that.action = ossToken.host
				
				//处理唯一文件名
				const suffix = fileName.slice(fileName.lastIndexOf('.'))
				this.upFileName = that.$u.guid(20) + suffix
				console.log(this.upFileName)
				that.formData = {
					'key':this.upFileName,//上传后的文件名
					'policy': ossToken.policy,
					'OSSAccessKeyId': ossToken.accessid,
					'success_action_status': '200',
					'signature': ossToken.signature,
				}
				// console.log(ossToken)
				return true;
			},
			//上传成功之后
			async onSuccess(){
				//移除预览区的图片
				this.$refs.upload.remove(0)
				//请求API更新头像
				await this.$u.api.userAvatar({avatar: this.upFileName})
				//更新缓存的用户信息
				this.$u.utils.updateUser()
				this.$u.toast('更新成功')
			}
		}
	}
</script>

<style>

</style>
