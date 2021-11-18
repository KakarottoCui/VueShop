<template>
  <div id="admin-sales">
    <div v-if="!orders.length">您还未下单</div>
    <div v-else>
      <div
        class="single-order"
        v-for="(order, order_index) in orders"
        :key="order_index"
      >
        <div class="single-header">订单号：{{ order.id }}</div>
        <div
          class="order-goods"
          v-for="(good, index) in order.goods"
          :key="index"
        >
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
            <span class="counts">共{{ good.count }}件</span></el-col
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { getAdminOrders } from "../../../api/index";
export default {
  data() {
    return {
      orders: [],
    };
  },
  computed: {
    ...mapState(["userInfo"]),
  },
  created() {
    this.getOrder();
  },
  methods: {
    //1.获取订单信息
    getOrder() {
      console.log("获取所有订单...");
      this.queryAllOrder();
    },
    //2.获取所有订单信息
    async queryAllOrder() {
      const result = await getAdminOrders();
      if (result.success_code === 200) {
        this.orders = result.message;
      }
    },
  },
};
</script>

<style scoped>
.single-order {
  margin: 10px;
  box-shadow: 0px 0px 2px 2px #d8d8d833;
}
.single-order .single-header {
  padding: 15px;
  font-size: 15px;
}
.single-order .order-goods {
  min-height: 150px;
  padding: 15px;
  border-bottom: 1px solid #d8d8d87d;
}

.single-order .order-goods .images {
  max-width: 200px;
  height: 79px;
  border-radius: 5px;
}

.single-order .order-goods .desc {
  padding-left: 20px;
  font-size: 20px;
}

.single-order .order-goods .price-part .price {
  font-size: 20px;
  font-weight: 600;
}
</style>
