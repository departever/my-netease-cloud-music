<template>
    <div class="user">
        <!-- 登录前 -->
        <div @click="onOpenModal" class="login-trigger" v-if="!isLogin">
            <i class="user-icon iconfont icon-yonghu" />
            <p class="user-name">未登录</p>
        </div>
        <!-- 登录后 -->
        <div @click="onLogout" class="logined-user" v-else>
            <img v-lazy="$utils.genImgUrl(user.avatarUrl, 80)" class="avatar" />
            <p class="user-name">{{ user.nickname }}</p>
        </div>

        <!-- 登录框 -->
        <el-dialog :modal="false" v-model="visible" :width="$utils.toRem(320)">
            <p slot="title">登录</p>
            <div class="login-body">
                <el-input class="input" placeholder="请输入您的网易云uid" v-model="uid" />
                <div class="login-help">
                    <p class="help">
                        1、请
                        <a href="http://music.163.com" target="_blank">点我(http://music.163.com)</a>打开网易云音乐官网
                    </p>
                    <p class="help">2、点击页面右上角的“登录”</p>
                    <p class="help">3、点击您的头像，进入我的主页</p>
                    <p class="help">
                        4、复制浏览器地址栏 /user/home?id= 后面的数字（网易云 UID）
                    </p>
                </div>
            </div>
            <span class="dialog-footer" slot="footer">
                <el-button :loading="loading" @click="onLogin(uid)" class="login-btn" type="primary">登录</el-button>
            </span>
        </el-dialog>

        <Confirm v-model="logoutVisible" :title="confirmTitle" :text="confirmText" :on-confirm="handleConfirm" />
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import storage from "good-storage"
import { UID_KEY, isDef } from "@/utils"
import { useUserStore } from "@/store/user"

const userStore = useUserStore()
const visible = ref(false)
const loading = ref(false)
const uid = ref("")
const isLogin = computed(() => userStore.isLogin);
const user = computed(() => userStore.user);

const logoutVisible = ref(false)
const confirmTitle = ref('确认操作');
const confirmText = ref('你确定要注销吗？');


onMounted(() => {
    const uidValue = storage.get(UID_KEY)
    if (isDef(uidValue)) {
        onLogin(uidValue)
    }
})

const onOpenModal = () => {
    visible.value = true
}

const onCloseModal = () => {
    visible.value = false
}

const onLogin = async (uidValue) => {
    loading.value = true
    try {
        const success = await userStore.login(uidValue)
        if (success) {
            onCloseModal()
        }
    } finally {
        loading.value = false
    }
}

const onLogout = () => {
    confirmTitle.value = '确认操作';
    confirmText.value = '你确定要注销吗？';
    logoutVisible.value = true; // 显示确认框
    handleConfirm();
};

const handleConfirm = () => {
    userStore.logout(); // 执行注销操作
    logoutVisible.value = false; // 隐藏确认框
};
</script>

<style lang="scss" scoped>
.user {
    padding: 16px;
    padding-bottom: 0;
    margin-bottom: 12px;

    .login-trigger {
        display: flex;
        align-items: center;
        cursor: pointer;
    }

    .user-icon {
        font-size: 24px;
    }

    .user-name {
        margin-left: 8px;
    }

    .logout {
        transform: translateY(1px);
        margin-left: 8px;
        color: var(--font-color-shallow-grey);
    }

    .login-body {
        .input {
            margin-bottom: 16px;
        }

        .login-help {
            .help {
                margin-bottom: 4px;
            }
        }
    }

    .login-btn {
        width: 100%;
        padding: 8px 0;
    }

    .logined-user {
        display: flex;
        align-items: center;
        cursor: pointer;

        .avatar {
            @include round(40px);
        }
    }
}
</style>