<style>
.map-img {
    width: 150px;
    height: 100px;
    border: 1px solid rgb(204, 204, 204);
    cursor: pointer;
}
</style>
<template>
    <div class="form-group">
        <label class="col-lg-3 col-md-3 col-sm-3 col-xs-12 control-label">{{labelName}}</label>
        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
            <div>
                <img class="map-img" v-on:click="open" :src="mapPreviewUrl" />
                <input type="hidden" data-rule-required="{{required}}" name="{{fieldName}}" v-model="value">
            </div>
            <span class="help-block">{{tips}}</span>
        </div>
    </div>
    <div v-if="dialogStates" v-modal class="modal fade container">
        <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
            <h4 class="modal-title"><i class="fa fa-image"></i> 坐标选择</h4>
        </div>
        <div class="modal-body">
            <div class="row">
                <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <div class="form-inline" style="padding: 0px 10px;">
                        <div class="form-group" style="margin-right: 5px;">
                            <label style="margin-right: 5px;">搜索: </label>
                            <input type="text" v-model="txtCity" v-on:keyup.enter="btnSearchClick" class="form-control input-small " placeholder="城市">
                        </div>
                        <div class="input-group">
                            <input type="text" v-model="txtAddress" v-on:keyup.enter="btnSearchClick" class="form-control " placeholder="地址">
                            <span class="input-group-btn">
                            <button class="btn blue" v-on:click="btnSearchClick" type="button">
                            <i class="icon-magnifier"></i>查找</button>
                            </span>
                        </div>
                    </div>
                </div>
                <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <div class="mapContainer" style="width:100%;height:300px;margin: 10px 0px;"></div>
                </div>
            </div>
        </div>
        <div class="modal-footer">
            <button type="button" data-dismiss="modal" class="btn btn-outline dark">取消
            </button>
            <button type="button" v-on:click="dialogOnConfirm" class="btn green">确定</button>
        </div>
    </div>
</template>
<script>
import $script from "scriptjs";
/*
baidu key:EX4XQlSBFxtBNWKOXBQKAiGTcD76guoM
*/
export default {
    props: {
        labelName: {
            type: String,
            default: "",
        },
        fieldName: {
            type: String,
            default: function() {
                return "fieldName_" + (new Date()).getTime();
            }
        },
        tips: {
            type: String,
            default: ""
        },
        required: {
            type: String,
            default: "false"
        },
        placeholder: {
            type: String,
            default: ""
        },
        value: {
            twoWay: true
        },
        type: {
            type: String,
            default: 'baidu',
            required: true
        }
    },
    data() {
        return {
            mapPreviewUrl: require('../images/img_no_map_300x200.png'),
            dialogStates: false,
            defaultValue: '114.063956,22.56013',
            txtCity: '深圳市',
            txtAddress: '',
            searchHandler: null,
            currentValue: '',
        }
    },
    ready() {
        // if (!this.value || this.value == '') {
        //     this.value = this.defaultValue;
        // }
        // this.currentValue = this.value;
        this.initPreview();
    },
    directives: {
        'modal': {
            bind: function() {
                var self = this;
                $(this.el).modal({}).on('hide.bs.modal', function() {
                    self.vm.dialogStates = false;
                });
                //初始化地图
                this.vm.initMapContainer(this.el);
            },
            unbind: function() {
                //                    $('.modal-backdrop').remove();
                $(this.el).modal('hide');
                // $(this.el).modal('destroy');
            }
        }
    },
    watch: {
        'value': function(val, oldValue) {
            this.initPreview();
        }
    },
    methods: {
        dialogOnConfirm: function() {
            this.value = this.currentValue;
            this.dialogStates = false;
            this.initPreview();
        },
        initPreview: function() {
            if (this.value != '') {
                var lnglat = this.value.split(',');
                if (this.type == 'baidu') {
                    this.mapPreviewUrl = 'http://api.map.baidu.com/staticimage?center=' + lnglat[0] + ',' + lnglat[1] + '&width=300&height=200&zoom=11&markers=' + lnglat[0] + ',' + lnglat[1];
                }
            }
        },
        open: function() {
            this.dialogStates = true;
        },
        btnSearchClick: function() {
            if (this.searchHandler) {
                this.searchHandler();
            }
        },
        initMapContainer: function(dialogElm) {
            var lnglat = null;
            var $container = $(dialogElm).find('.mapContainer');
            if (this.value && this.value != '') {
                lnglat = this.value.split(',');
            } else {
                lnglat = this.defaultValue.split(',');
            }
            if (this.type == 'baidu') {
                this.initBaiduMap($container, lnglat);
            }
        },
        initBaiduMap: function($container, lnglat) {
            var vm = this;
            // console.log('init baidu map', $container, lnglat);
            $script('http://api.map.baidu.com/getscript?v=2.0&ak=EX4XQlSBFxtBNWKOXBQKAiGTcD76guoM&services=&t=20150522094656', function() {
                // console.log('async load baidu api success');
                window.setTimeout(function() {
                    var map = new BMap.Map($container[0]),
                        marker, point;
                    map.reset();
                    point = new BMap.Point(Number(lnglat[0]), Number(lnglat[1]));
                    map.enableScrollWheelZoom();
                    map.addControl(new BMap.NavigationControl()); // 添加平移缩放控件
                    map.addControl(new BMap.ScaleControl()); // 添加比例尺控件
                    map.addControl(new BMap.OverviewMapControl());
                    map.centerAndZoom(point, 13);
                    map.setCenter(point);
                    map.panTo(point);
                    marker = new BMap.Marker(point);
                    marker.enableDragging();
                    marker.addEventListener('dragend', function(event) {
                        var point = event.point;
                        map.centerAndZoom(point, 13);
                        vm.currentValue = [point.lng, point.lat].join(',');
                    });
                    map.addOverlay(marker);
                    vm.searchHandler = function() {
                        if (vm.txtCity == '') {
                            vm.$dispatch('toastr', '请输入城市名称', 'error');
                            return;
                        }

                        var search = new BMap.LocalSearch(vm.txtCity, {
                            'onSearchComplete': function(results) {
                                if (results && results.getNumPois()) {
                                    var points = [];
                                    for (var i = 0; i < results.getCurrentNumPois(); i++) {
                                        points.push(results.getPoi(i).point);
                                    }
                                    if (points.length >= 1) {
                                        marker.setPosition(points[0]);
                                        map.centerAndZoom(points[0], 13);
                                        vm.currentValue = [points[0].lng, points[0].lat].join(',');
                                    } else {
                                        vm.$dispatch('toastr', '找不到具体位置', 'error');
                                    }
                                } else {
                                    vm.$dispatch('toastr', '找不到具体位置', 'error');
                                }
                            }
                        });
                        search.search(vm.txtCity + vm.txtAddress);
                    }
                }, 500);

            });
        }
    },
    components: {}
}
</script>
