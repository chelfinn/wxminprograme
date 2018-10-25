//index.js
//获取应用实例
Page({
  data: {
    
  },
  onLoad: function (){
		var that = this;
		wx.request({
			url: 'https://sudups.com/wx/specifications.json',
			success: function (res){
				if (res.data.code == 200) {
					var datas = res.data.datas;
					var specObj = res.data.datas.goods_info.spec_name;
					var tmp = {}; //商品规格类
					var tmp2 = {}; //商品规格子类
					var specALLArr = []; // 商品规格和商品
					for (var i in specObj) {
						tmp.id = i;  	
						tmp.name = specObj[i];
						tmp.twoData = [];
						for (var j in res.data.datas.goods_info.spec_value[i]) {
							tmp2.id = j;
							tmp2.name = res.data.datas.goods_info.spec_value[i][j];
							tmp2.propertyID = i;
							tmp.twoData.push(JSON.parse(JSON.stringify(tmp2)));
						}
						specALLArr.push(JSON.parse(JSON.stringify(tmp)));
					};
					that.setData({
						specALLArr: specALLArr,
						detailData: datas,  //商品详情
						goods_price: datas.goods_info.goods_price, //商品价格
						goods_image: datas.goods_image,
						goods_storage: datas.goods_info.goods_storage, //商品库存
					});
				};
			},
		});
	},
  /**
   * 切换规格选中状态
   * @author chelfinn
   */
	clickTap: function (e) {
		var that = this;
		var specALLArr = that.data.specALLArr;
		var childs = that.data.specALLArr[e.currentTarget.dataset.propertyindex].twoData;
		// 取消该分类下的子栏目所有的选中状态
		for (var i = 0; i < childs.length; i++) {
			that.data.specALLArr[e.currentTarget.dataset.propertyindex].twoData[i].active = false;
		}
		// 设置当前选中状态
		that.data.specALLArr[e.currentTarget.dataset.propertyindex].twoData[e.currentTarget.dataset.propertychildindex].active = true;
		that.setData({
			specALLArr: specALLArr
		});
		// 获取所有的选中规格尺寸数据
		var needSelectNum = that.data.specALLArr.length;
		var curSelectNum = 0;
		var propertyChildIds = "";
		var propertyChildNames = "";
		for (var i = 0; i < that.data.specALLArr.length; i++) {
			childs = that.data.specALLArr[i].twoData;
			for (var j = 0; j < childs.length; j++) {
				if (childs[j].active) {
					curSelectNum++;
					propertyChildIds = propertyChildIds + childs[j].id + '|';
					propertyChildNames = propertyChildNames + childs[j].name + " ";
				}
			}
		}
		propertyChildIds = propertyChildIds.substr(0, propertyChildIds.length - 1);
		propertyChildNames = propertyChildNames.substr(0, propertyChildNames.length - 1);
		that.setData({
			propertyChildNames: propertyChildNames, //获取购买的商品id
		});
		var spec_list = that.data.detailData.spec_list;
		if (propertyChildIds in spec_list) {
			that.setData({
				buyGoods_id: spec_list[propertyChildIds], //获取购买的商品id
			});
		}
	},
})
