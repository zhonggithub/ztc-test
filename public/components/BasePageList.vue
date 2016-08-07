<script>
import moment from "moment";
import filesize from 'filesize';

export default {
    filters: {
        formatDateTime: function(value) {
            return moment.unix(value).format('YYYY-MM-DD HH:mm:ss');
        },
        formatDate: function(value) {
            return moment.unix(value).format('YYYY-MM-DD')
        },
    },
    methods: {
        dispatchEvent: function(eventName, args) {
            this.$dispatch(eventName, args)
        },
        broadcastEvent: function(eventName, args) {
            this.$broadcast(eventName, args)
        },
        reload: function(target) {
            this.broadcastEvent('vuetable:reset-search-and-reload', target);
        },
        getStatus: function(value) {
            return value == 1 ? '<span class="label label-sm label-primary">正常</span>' : '<span class="label label-sm label-danger">锁定</span>';
        },
        formatDate: function(value) {
            return moment.unix(value).format('YYYY-MM-DD')
        },
        formatDateTime: function(value) {
            return moment.unix(value).format('YYYY-MM-DD HH:mm:ss')
        },
        getIsOnlineText: function(value) {
            return value ? '<span class="label label-sm label-primary">在线</span>' : '<span class="label label-sm label-danger">离线</span>';
        },
        getTrueFalseText: function(value) {
            return value ? '<span class="label label-sm label-primary">是</span>' : '<span class="label label-sm label-danger">否</span>';
        },
        getSizeText: function(value) {
            if (!value) {
                value = 0;
            }

            return filesize(value);
        },
        getOpModeText: function(value) {
            if (value == 0) {
                return '网关模式';
            } else {
                return '桥接模式'
            }
        },
        getSupplier: function(value) {
            var result = '未知';
            switch (value) {
                case 'SUNLIGHT':
                    result = '盛阳';
                    break;
                case 'SUNLIGHT_1602':
                    result = '盛阳1602';
                    break;
                case 'RUIJIE':
                    result = '锐捷';
                    break;
            }
            return result;
        },
    }
}
</script>
