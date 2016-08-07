<style>
</style>
<template>
    <div class="page-bar">
        <ul class="page-breadcrumb">
            <li>
                <a v-link="{path:'/'}">Home</a>
                <i class="fa fa-circle"></i>
            </li>
            <li>
                <span>表单控件演示</span>
            </li>
        </ul>
    </div>
    <h3 class="page-title"> 表单控件演示
        <small></small>
    </h3>
    <div class="row">
        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <div class="portlet light bordered">
                <div class="portlet-title">
                    <div class="caption">
                        <i class="icon-equalizer font-red-sunglo"></i>
                        <span class="caption-subject font-red-sunglo bold ">编辑</span>
                    </div>
                </div>
                <div class="portlet-body form">
                    <vue-form>
                        <vue-input label-name="租户名称" required="true" field-name="Name" tips="租户名称" :value.sync="form.Name">
                        </vue-input>
                        <vue-area-select label-name="所在地" tips="提示" province-value="广东省" city-value="深圳市" district-value="福田区">
                        </vue-area-select>
                        <vue-html-editor label-name="label" tips="tips" filed-name="Content" :value.sync="Content"></vue-html-editor>
                        <vue-select2 label-name="select2" tips="提示文本" :value.sync="form.Select2Result" url="/tenant/console/tenant_source_list" field-name="input_select2"></vue-select2>
                        <vue-image-upload label-name="图片上传" tips="tips" history-url="/system/console/resource_list" system-url="/system/console/resource_list" upload-url="/system/console/upload" :value.sync="form.Images"></vue-image-upload>
                        <vue-color-picker label-name="颜色选择" tips="tips" format="rgba" :value.sync="form.Color"></vue-color-picker>
                        <vue-touch-spin label-name="spin" tips="tips" postfix="小时" :value.sync="form.Spin"></vue-touch-spin>
                        <vue-switch label-name="switch checkbox" tips="tips" :value.sync="form.Switch">
                        </vue-switch>
                        <vue-datetime-picker :value.sync="form.DateTime" tips="123123" label-name="datetime">
                        </vue-datetime-picker>
                        <vue-map-selector type="baidu" :value.sync="form.Location" tips="123123" label-name="map selector"></vue-map-selector>
                    </vue-form>
                </div>
            </div>
        </div>
        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <button type="button" v-on:click="btnTest1" class="btn btn-primary">bootbox test</button>
            <button type="button" v-on:click="btnTest2" class="btn btn-primary">toastr</button>
            <button type="button" v-on:click="btnTest3" class="btn btn-primary">bootstrap modal</button>
            <button type="button" class="btn btn-primary">Primary</button>
        </div>
    </div>
    <vue-modal v-ref:demo title="hello dialog">
        this is dialog body
    </vue-modal>
    <div class="clearfix"></div>
</template>
<script>
import "jquery-validation"
import bootbox from "bootbox"
import VueForm from "./VueForm"
import VueAreaSelect from "./VueAreaSelect"
import VueHtmlEditor from "./VueHtmlEditor"
import VueInput from "./VueInput"
import VueSelect2 from "./VueSelect2"
import VueModal from "./VueModal"
import VueImageUpload from "./VueImageUpload"
import VueColorPicker from "./VueColorPicker"
import VueTouchSpin from "./VueTouchSpin"
import VueSwitch from "./VueSwitch"
import VueDateTimePicker from "./VueDateTimePicker";
import VueMapSelector from './VueMapSelector';

export default {
    data() {
            return {
                form: {
                    Name: "",
                    Content: "",
                    Select2Result: "",
                    Images: [],
                    Color: "rgba(148,29,29,1)",
                    Spin: 0,
                    Switch: true,
                    DateTime: '',
                    Location: '114.063956,22.56013'
                },

            }
        },
        ready() {

        },
        methods: {
            'btnSubmit': function() {
                console.log('click');
            },
            'btnTest1': function() {
                bootbox.confirm("是否删除选择?", function(result) {
                    console.log(result);
                    if (result) {

                    }
                });
            },
            'btnTest2': function() {
                console.log('toastr click');
                this.$dispatch('toastr', 'hi', 'error');
            },
            'btnTest3': function() {
                this.$refs.demo.show();
            }
        },
        events: {
            'vue-form:submit': function(data) {
                console.log(data);
            },
        },
        components: {
            'vue-form': VueForm,
            'vue-area-select': VueAreaSelect,
            'vue-html-editor': VueHtmlEditor,
            'vue-input': VueInput,
            'vue-select2': VueSelect2,
            'vue-modal': VueModal,
            'vue-image-upload': VueImageUpload,
            'vue-color-picker': VueColorPicker,
            'vue-touch-spin': VueTouchSpin,
            'vue-switch': VueSwitch,
            'vue-datetime-picker': VueDateTimePicker,
            'vue-map-selector': VueMapSelector
        }
}
</script>
