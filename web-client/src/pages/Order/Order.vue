<template>
  <div>
    <el-container class="container">
      <el-header class="header"> <span>确认订单</span></el-header>
      <el-main class="body_content">
        <div class="single_part address">
          <el-row>
            <el-col :span="2" style="text-align: center"
              ><i class="el-icon-location-outline position"
            /></el-col>
            <el-col :span="20"
              ><div
                class="input-address"
                @click="dialogVisible = true"
                v-if="nowUserInfo.user_order_addr"
              >
                {{ nowUserInfo.user_order_addr }}
              </div>
              <div class="input-address" @click="dialogVisible = true" v-else>
                请填写地址
              </div></el-col
            >
            <el-col :span="2" style="text-align: center"
              ><i class="el-icon-arrow-right arrow-right"
            /></el-col>
          </el-row>
          <div></div>
        </div>
        <div class="single_part send_time">
          <el-row>
            <el-col :span="8"
              ><div class="left"><span>送达时间</span></div></el-col
            >
            <el-col :span="16"
              ><div class="right">尽快送达 | 预计 28 小时</div></el-col
            >
          </el-row>
        </div>
        <div class="single_part goods_detail">
          <div class="single-goods" v-for="(good, index) in goods" :key="index">
            <el-col :span="6" style="text-align: center"
              ><el-image class="images" fit="contain" :src="good.thumb_url">
                <div slot="placeholder" class="image-slot">
                  加载中<span class="dot">...</span>
                </div>
              </el-image></el-col
            >
            <el-col :span="14"
              ><div class="desc">
                {{ good.goods_name }}
              </div></el-col
            >
            <el-col :span="4" class="price-part"
              ><span>￥</span><span class="price">{{ good.price }}</span>
              <span class="counts">共{{ good.buy_count }}件</span></el-col
            >
          </div>
        </div>
      </el-main>
      <el-footer class="footer">
        <el-col :span="20"
          ><div class="left">
            <span>待支付：￥{{ totalPrice }}</span>
          </div></el-col
        >
        <el-col :span="4"
          ><div class="right" @click="doAddOrder()">确认下单</div></el-col
        >
      </el-footer>
    </el-container>

    <el-dialog title="请填写" :visible.sync="dialogVisible" width="30%">
      <el-form :model="form">
        <el-form-item label="收货地址">
          <el-input
            v-model="form.orderAddr"
            autocomplete="off"
            placeholder="请填写您的收货地址"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleClose()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { addOrder, getUserInfo, getCartsGoods } from "../../api/index";
export default {
  data() {
    return {
      estimatedTime: 28,
      address: "",
      goods: [],
      totalPrice: 0,
      nowUserInfo: {},
      dialogVisible: false,
      form: {
        orderAddr: "",
      },
    };
  },
  computed: {
    ...mapState(["userInfo"]),
  },
  created() {
    this.queryCartInfo();
  },
  methods: {
    //1.执行下单操作
    async doAddOrder() {
      //地址不能为空
      if (!this.address) {
        this.$message.error("请先填写收货地址！");
        return;
      }
      var queryData = {
        user_id: this.nowUserInfo.id,
        goods: this.goods,
        address: this.address,
      };
      const result = await addOrder(queryData);
      if (result.success_code === 200) {
        this.$message("下单成功！");
        this.$router.replace("/me/profile");
      } else {
        this.$message("下单失败！");
      }
    },
    //2.获取购物车信息
    async queryCartInfo() {
      const result = await getCartsGoods({ user_id: this.userInfo.id });
      if (result.success_code === 200) {
        this.goods = result.message;
        if (this.goods.length) {
          this.goods.forEach((good) => (this.totalPrice += good.price));
          this.queryUserInfo();
        }
      }
    },
    //3.获取用户信息
    async queryUserInfo() {
      const result = await getUserInfo({ user_id: this.goods[0].user_id });
      if (result.success_code === 200) {
        this.nowUserInfo = result.message;
        this.address = this.nowUserInfo.user_order_addr;
      }
    },
    //3.填充收货地址数据
    handleClose() {
      this.dialogVisible = false;
      this.nowUserInfo.user_order_addr = this.form.orderAddr;
      this.address = this.form.orderAddr;
      this.form.orderAddr = "";
    },
  },
};
</script>
<style scoped>
.container {
  font-family: "Helvetica Neue";
}
.header {
  background: #409eff;
  font-size: 25px;
  color: #ffffff;
  text-align: center;
  padding: 9px 16px;
}

.body_content {
  padding: 0;
}
.body_content .single_part {
  margin: 0 4px 6px 4px;
  box-shadow: 0px 0px 2px 2px #d8d8d833;
}
.address {
  height: 150px;
  line-height: 150px;
}

.address i {
  font-size: 37px;
}

.address .position {
  color: #409eff;
}
.address .input-address {
  font-size: 25px;
  margin-left: 30px;
  cursor: pointer;
}

.address .arrow-right {
  color: #d8d8d8;
}

.send_time {
  min-height: 150px;
  line-height: 150px;
}

.send_time .left {
  text-align: center;
  font-size: 25px;
  font-weight: 700;
}

.send_time .right {
  float: right;
  margin-right: 23%;
  color: #409effd9;
  font-size: 20px;
}

.goods_detail {
  min-height: 700px;
}

.goods_detail .single-goods {
  min-height: 200px;
  padding: 25px 20px 0 20px;
}

.single-goods .images {
  max-width: 224px;
  height: 160px;
  border-radius: 2px;
}

.single-goods .desc {
  margin: 0px 7%;
  font-size: 22px;
  font-weight: 600;
  word-break: hyphenate;
}

.single-goods .price-part {
  text-align: center;
  margin-top: 15%;
}

.single-goods .price {
  font-size: 20px;
  font-weight: 600;
}

.single-goods .counts {
  font-size: 10px;
  font-weight: 600;
  color: #afafaf;
}

.footer {
  padding: 0 5px;
  height: 80px;
  line-height: 80px;
  color: #ffffff;
  font-size: 25px;
}

.footer .left {
  background-color: #000000c9;
  padding-left: 8%;
}

.footer .right {
  background-color: #67c23a;
  text-align: center;
  cursor: pointer;
}
</style>