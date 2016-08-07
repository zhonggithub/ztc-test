<style>
@import "../../node_modules/bootstrap-select/dist/css/bootstrap-select.min.css";
</style>
<template>
    <div class="form-group">
        <label class="col-lg-3 col-md-3 col-sm-3 col-xs-12 control-label">{{labelName}}</label>
        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
            <div class="row" v-if="initSuccess">
                <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12">
                    <select v-if="provinceOptions.length>0" v-selectpicker="provinceValue" name="{{provinceFieldName}}" class="form-control show-tick " title="请选择" data-type="Province" data-rule-required="false">
                        <option></option>
                        <template v-for="item in provinceOptions">
                            <option value="{{item.name}}" :selected="provinceValue == item.name" data-item="{{item|json}}" data-id="{{item.id}}">
                                {{item.name}}
                            </option>
                        </template>
                    </select>
                </div>
                <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12">
                    <select v-if="cityOptions.length>0" v-selectpicker="cityValue" name="{{cityFieldName}}" class="form-control show-tick " title="请选择" data-type="City" data-rule-required="false">
                        <option></option>
                        <template v-for="item in cityOptions">
                            <option value="{{item.name}}" :selected="cityValue == item.name" data-item="{{item|json}}" data-id="{{item.id}}">
                                {{item.name}}
                            </option>
                        </template>
                    </select>
                </div>
                <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12">
                    <select v-if="districtOptions.length > 0" v-selectpicker="districtValue" name="{{districtFieldName}}" class="form-control show-tick " title="请选择" data-type="District" data-rule-required="false">
                        <option></option>
                        <template v-for="item in districtOptions">
                            <option value="{{item.name}}" :selected="districtValue == item.name" data-item="{{item|json}}" data-id="{{item.id}}">
                                {{item.name}}
                            </option>
                        </template>
                    </select>
                </div>
            </div>
            <span class="help-block">{{tips}}</span>
        </div>
    </div>
</template>
<script>
import "bootstrap-select"
import _ from "lodash"
export default {
    props: {
        labelName: {
            type: String,
            required: true
        },
        tips: {
            type: String,
            default: ""
        },
        provinceFieldName: {
            type: String,
            default: "Province"
        },
        provinceValue: {
            twoWay: true
        },
        cityFieldName: {
            type: String,
            default: "City"
        },
        cityValue: {
            twoWay: true
        },
        regionCode: {
            twoWay: true
        },
        districtFieldName: {
            type: String,
            default: "District"
        },
        districtValue: {
            twoWay: true
        },
        sourceUrl: {
            type: String,
            default: function() {
                //数据源获取地址
                return '/admin/console/getAreaData'
            }
        }
    },
    data() {
        return {
            'sourceData': [],
            'provinceOptions': [],
            'cityOptions': [],
            'districtOptions': [],
            initSuccess: false,
        }
    },
    directives: {
        'selectpicker': {
            deep: true,
            twoWay: true,
            bind: function(value) {
                var self = this;

                var _options = {
                    iconBase: 'fa',
                    tickIcon: 'fa-check',
                    size: 10
                };

                $(this.el).selectpicker(_options).on('changed.bs.select', function() {
                    self.set($(this).val());
                    var tmpSelectItem = $(this).find(':selected').data('item');
                    if (tmpSelectItem) {
                        self.vm.$set('regionCode', tmpSelectItem.id);
                        if ($(this).data('type') == 'Province') {
                            self.vm.$set('cityOptions', tmpSelectItem.child);
                        } else if ($(this).data('type') == 'City') {
                            self.vm.$set('districtOptions', tmpSelectItem.child);
                        }
                    }
                });

                var type = $(this.el).data('type');
                if (type == 'Province') {
                    $(this.el).selectpicker('val', this.vm.provinceValue);
                } else if (type == 'City') {
                    $(this.el).selectpicker('val', this.vm.cityValue);
                } else if (type == 'District') {
                    $(this.el).selectpicker('val', this.vm.districtValue);
                }
                $(this.el).selectpicker('refresh');

                var tmpSelectItem = $(this.el).find(':selected').data('item');
                // console.log('init selectpicker', $(this.el).data('type'), tmpSelectItem);
                if (tmpSelectItem) {
                    self.vm.$set('regionCode', tmpSelectItem.id);
                    if ($(this.el).data('type') == 'City') {
                        self.vm.$set('districtOptions', tmpSelectItem.child);
                    } else if ($(this.el).data('type') == 'Province') {
                        self.vm.$set('cityOptions', tmpSelectItem.child);
                    }
                }
                // console.log('bind finish', tmpSelectItem);
            },
            update: function(newValue, oldValue) {

            },
            unbind: function() {

            }
        }
    },
    ready() {
        // console.log('ready', this.provinceValue, this.cityValue, this.districtValue);
        this.$http.get(this.sourceUrl).then(
            function(resp) {
                if (resp.data.error_code == 0) {
                    this.sourceData = resp.data.data;
                    this.initSelect();
                }
            },
            function(resp) {}
        );
    },
    watch: {
        'cityOptions': function(val, oldValue) {
            var $elm = $(this.$el).find('select[data-type="City"]');
            if (this.cityValue != '') {
                $elm.selectpicker('val', this.cityValue);
            }
            $elm.selectpicker('refresh');
        },
        'districtOptions': function(val, oldValue) {
            var $elm = $(this.$el).find('select[data-type="District"]');
            if (this.districtValue != '') {
                $elm.selectpicker('val', this.districtValue);
            }
            $elm.selectpicker('refresh');
        },
    },
    methods: {
        initSelect: function() {
            var provinceOptions = [];
            _.each(this.sourceData, function(v, k) {
                provinceOptions.push(v);
            });
            this.provinceOptions = provinceOptions;

            this.initSuccess = true;
        },
    },
}
</script>
