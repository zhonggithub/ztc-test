<style>
@import "../../node_modules/dropzone/dist/dropzone.css";
.modal.container {
    max-width: 900px !important;
}

.imageupload-list {}

.imageupload-list .item {
    position: relative;
    margin-bottom: 10px;
}

.imageupload-list .item .thumb {
    max-width: 71px;
    min-width: 71px;
}

.imageupload-list .btnRemove {
    position: absolute;
    top: -6px;
    left: 66px;
    cursor: pointer;
}

div.imageupload-item-tips {
    width: 100%;
    position: absolute;
    bottom: 0;
    line-height: 25px;
    background-color: rgba(60, 60, 60, 0.6);
    left: 0;
    text-align: center;
    color: #ffffff;
}

div.imageupload-item-tips.selected {
    background-color: red;
}

.dropzone {
    border: 1px solid rgba(0, 0, 0, .03);
}

.dropzone .dz-message {
    background-image: url('../images/img_dropzone_tips_420x120.png');
    background-repeat: no-repeat;
    background-position: 50% 50%;
    height: 300px;
}

.image-data-list .thumbnail {
    position: relative;
    background-image: url('../images/imageupload-components-img_bg_380x380.jpg')
}
</style>
<template>
    <div class="form-group">
        <label class="col-lg-3 col-md-3 col-sm-3 col-xs-12 control-label">{{labelName}}</label>
        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
            <div class="components_imageupload">
                <input type="hidden" name="components_imageupload_validate_{{fieldName}}[]" data-rule-image-min="{{min}}" data-rule-image-max="{{max}}" />
                <ul class="list-inline imageupload-list">
                    <template v-for="image in value">
                        <li class="item item-dragdrop">
                            <input type="hidden" name="{{fieldName}}" value="{{image}}">
                            <a v-fancybox href="{{image}}">
                                <img class="thumb" v-bind:src="image">
                            </a>
                            <span v-on:click="removeImage(image)" class="badge badge-danger btnRemove">X</span>
                        </li>
                    </template>
                    <li v-if="canAddFile" class="item-add">
                        <a class="item" v-on:click="showDialog" href="javascript:;">
                            <img class="thumb" src="../images/icon_add_70x70.png" alt="">
                        </a>
                    </li>
                </ul>
            </div>
            <span class="help-block">{{tips}}</span>
        </div>
    </div>
    <div v-if="openDialog" v-modal class="modal fade container imageDialog">
        <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
            <h4 class="modal-title"><i class="fa fa-image"></i> 图片选择</h4>
        </div>
        <div class="modal-body">
            <div class="row">
                <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <div class="tabbable-line">
                        <ul class="nav nav-tabs ">
                            <li class="active">
                                <a href="#tab_image_upload_1" data-toggle="tab"><i class="fa fa-upload"></i> 上传</a>
                            </li>
                            <li>
                                <a href="#tab_image_upload_2" data-toggle="tab"><i class="fa fa-picture-o"></i> 系统素材</a>
                            </li>
                            <li>
                                <a href="#tab_image_upload_3" data-toggle="tab"><i class="fa fa-history"></i> 历史上传</a>
                            </li>
                            <li>
                                <a href="#tab_image_upload_4" data-toggle="tab"><i class="fa fa-cloud-upload"></i> 远程图片</a>
                            </li>
                        </ul>
                        <div class="tab-content">
                            <div class="tab-pane active" id="tab_image_upload_1">
                                <div class="dropzone">
                                    <div class='dz-message'></div>
                                </div>
                            </div>
                            <div class="tab-pane" id="tab_image_upload_2">
                                <ul class="list-inline image-data-list">
                                    <span v-if="!systemRows.length">
                                    没有数据
                                </span>
                                    <template v-for="row in systemRows">
                                        <li>
                                            <a v-on:click="dialogInsertImage(row,row.Url)" href="javascript:;" class="thumbnail">
                                                <div v-bind:style="{'background-image': 'url(' + row.Url + ')'}" style="background-repeat: no-repeat;background-size: cover; width: 120px;height:120px;"></div>
                                                <div v-bind:class="{'selected':row.Selected }" class="imageupload-item-tips">{{row.Size}}
                                                </div>
                                            </a>
                                        </li>
                                    </template>
                                </ul>
                                <p class="page_nav text-right"></p>
                            </div>
                            <div class="tab-pane" id="tab_image_upload_3">
                                <ul class="list-inline image-data-list">
                                    <span v-if="!historyRows.length">
                                    没有数据
                                </span>
                                    <template v-for="row in historyRows">
                                        <li>
                                            <a v-on:click="dialogInsertImage(row,row.Url)" href="javascript:;" class="thumbnail">
                                                <div v-bind:style="{'background-image': 'url(' + row.Url + ')'}" style="background-repeat: no-repeat;background-size: cover; width: 120px;height:120px;"></div>
                                                <div v-bind:class="{'selected':row.Selected }" class="imageupload-item-tips">{{row.Size}}
                                                </div>
                                            </a>
                                        </li>
                                    </template>
                                </ul>
                                <p class="page_nav text-right"></p>
                            </div>
                            <div class="tab-pane" id="tab_image_upload_4">
                                <div class="form-horizontal">
                                    <div class="form-group">
                                        <label class="col-md-2 control-label">图片地址:</label>
                                        <div class="col-md-4">
                                            <input type="text" v-model="remoteUrl" class="form-control" placeholder="请输入图片地址">
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <div class="col-md-offset-2 col-md-10">
                                            <button type="button" v-on:click="getRemoteUrl" class="btn blue">获取</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12" v-show="showSelectBox">
                    <div class="portlet">
                        <div class="portlet-title">
                            <div class="caption">
                                <i class="fa fa-th"></i>已选
                            </div>
                            <div class="actions">
                                <button type="button" class="btn btn-xs red btnRemoveAll" v-on:click="dialogRemoveAll">
                                    <i class="fa fa-trash-o"></i>删除所有
                                </button>
                            </div>
                        </div>
                        <div class="portlet-body">
                            <ul class="list-inline imageupload-list">
                                <template v-for="image in tempValue">
                                    <li class="item item-dragdrop">
                                        <a v-fancybox href="{{image}}">
                                            <img class="thumb" v-bind:src="image">
                                        </a>
                                        <span v-on:click="dialogRemoveImage(image)" class="badge badge-danger btnRemove">X</span>
                                    </li>
                                </template>
                            </ul>
                        </div>
                    </div>
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
import Dropzone from "dropzone";
import VueModal from 'VueModal';
import "bootpag/lib/jquery.bootpag.min"

export default {
    props: {
        labelName: {
            type: String,
            default: "图片上传",
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
            type: Array,
            twoWay: true,
            default: []
        },
        //最大
        max: {
            type: Number,
            default: 1,
        },
        //最小
        min: {
            type: Number,
            default: 0,
        },
        maxFileSize: {
            type: Number,
            default: 2 //2 MB
        },
        //上传保存的
        uploadUrl: {
            type: String,
            required: true,
            default: ''
        },
        //历史资源图片
        historyUrl: {
            type: String,
            default: ''
        },
        //系统资源图片
        systemUrl: {
            type: String,
            default: ''
        },
    },
    directives: {
        'fancybox': {
            bind: function() {
                $(this.el).fancybox({
                    type: 'image'
                });
            },
            update: function(newValue, oldValue) {},
            unbind: function() {}
        },
        'modal': {
            bind: function() {
                var self = this;
                $(this.el).modal({}).on('hide.bs.modal', function() {
                    self.vm.openDialog = false;
                });

                //初始化dropzone
                $(this.el).find('.dropzone').dropzone({
                    url: self.vm.uploadUrl,
                    paramName: 'UploadFile',
                    acceptedFiles: 'image/*',
                    maxFilesize: self.vm.maxFileSize,
                    dictDefaultMessage: '拖动文件到此处!',
                    dictFallbackMessage: '您的浏览器不支持拖拽文件!',
                    dictInvalidFileType: '文件类型不匹配',
                    dictFileTooBig: '文件太大,只接受{{maxFilesize}}',
                    dictResponseError: '服务器返回错误:{{statusCode}}',
                    dictMaxFilesExceeded: '超出文件数量限制',
                    success: function(file, response) {
                        var $preview = $(file.previewElement);
                        //   var data = $.parseJSON(response);
                        if (response.error_code == 0) {
                            $preview.addClass("dz-success");
                            //成功后添加到已选列表
                            self.vm.tempValue.push(response.data);
                        } else {
                            $preview.addClass("dz-error");
                            $preview.find('span[data-dz-errormessage]').html(response.error_msg);
                        }
                    },
                    init: function() {
                        self.ctlDropzone = this;
                        this.on("addedfile", function(file) {
                            var removeButton = Dropzone.createElement("<button class='btn btn-sm btn-block'>删除</button>");
                            var _this = this;
                            removeButton.addEventListener("click", function(e) {
                                e.preventDefault();
                                e.stopPropagation();
                                _this.removeFile(file);
                            });
                            var $preview = $(file.previewElement);
                            $preview.find('.dz-filename').html('');
                            file.previewElement.appendChild(removeButton);
                        });
                    }
                });


                //load history
                if (self.vm.historyUrl != '') {
                    self.vm.ctlList.history_div = $(this.el).find('#tab_image_upload_3');
                    self.vm.ctlList.history_page_nav = $(self.vm.ctlList.history_div).find('.page_nav');
                    $(self.vm.ctlList.history_page_nav).bootpag({
                        paginationClass: 'pagination pagination-sm',
                        next: '<i class="fa fa-angle-right"></i>',
                        prev: '<i class="fa fa-angle-left"></i>',
                        total: 0,
                        page: 1,
                        maxVisible: 6
                    }).on('page', function(event, num) {
                        self.vm.loadHistoryData(num);
                    });
                    self.vm.loadHistoryData(1);
                }

                //load system
                if (self.vm.systemUrl != '') {
                    self.vm.ctlList.system_div = $(this.el).find('#tab_image_upload_2');
                    self.vm.ctlList.system_page_nav = $(self.vm.ctlList.system_div).find('.page_nav');
                    $(self.vm.ctlList.system_page_nav).bootpag({
                        paginationClass: 'pagination pagination-sm',
                        next: '<i class="fa fa-angle-right"></i>',
                        prev: '<i class="fa fa-angle-left"></i>',
                        total: 0,
                        page: 1,
                        maxVisible: 6
                    }).on('page', function(event, num) {
                        self.vm.loadSystemData(num);
                    });
                    self.vm.loadSystemData(1);
                }
            },
            unbind: function() {
                //                    $('.modal-backdrop').remove();
                $(this.el).modal('hide');
                // $(this.el).modal('destroy');
            }
        }
    },
    computed: {
        getCurrentCount: function() {
            return this.value.length;
        },
        showSelectBox: function() {
            return this.tempValue.length > 0;
        },
        canAddFile: function() {
            return this.max > this.value.length;
        },
    },
    methods: {
        removeImage: function(item) {
            this.value.$remove(item);
        },
        showDialog: function() {
            this.openDialog = true;
        },
        dialogInsertImage: function(row, url) {
            if (!_.includes(this.tempValue, url)) {
                if (row) {
                    row.Selected = true;
                }
                this.tempValue.push(url);
            }
        },
        dialogRemoveImage: function(item) {
            _.each(this.historyRows, function(v, k) {
                if (v.Url == item) {
                    v.Selected = false;
                }
            });
            _.each(this.systemRows, function(v, k) {
                if (v.Url == item) {
                    v.Selected = false;
                }
            });
            this.tempValue.$remove(item);
        },
        dialogRemoveAll: function() {
            this.tempValue = [];
        },
        dialogOnConfirm: function() {
            var vm = this;

            //判断长度
            if (this.tempValue.length + this.value.length > this.max) {
                this.$dispatch('toastr', '最多能选择' + (this.max - this.value.length) + '张图片', 'error');
                return;
            }

            _.each(this.tempValue, function(v, k) {
                if (!_.includes(vm.value, v)) {
                    vm.value.push(v);
                }
            });
            this.tempValue = [];
            this.openDialog = false;
        },
        getRemoteUrl: function() {
            this.dialogInsertImage(false, this.remoteUrl);
            this.remoteUrl = '';
        },
        loadSystemData: function(page) {
            var vm = this;
            this.$http.get(this.systemUrl, {
                per_page: 12,
                page: page
            }).then(function(response) {
                var data = response.data;
                if (data.data) {
                    _.each(data.data, function(v, k) {
                        v.Size = "0x0";
                        v.Selected = false;
                        _.each(vm.tempValue, function(vvv, kkk) {
                            if (v.Url == vvv) {
                                v.Selected = true;
                                return false;
                            }
                        });
                        (function(vv) {
                            $("<img/>") // Make in memory copy of image to avoid css issues
                                .attr("src", vv.Url).load(function() {
                                    vv.Size = this.width + 'x' + this.height;
                                });
                        })(v);
                    });
                    vm.systemRows = data.data;
                }

                $(vm.ctlList.system_page_nav).bootpag({
                    total: data.last_page,
                    maxVisible: 10
                });
            });
        },
        loadHistoryData: function(page) {
            var vm = this;
            this.$http.get(this.historyUrl, {
                per_page: 12,
                page: page
            }).then(function(response) {
                var data = response.data;
                if (data.data) {
                    _.each(data.data, function(v, k) {
                        v.Size = "0x0";
                        v.Selected = false;
                        _.each(vm.tempValue, function(vvv, kkk) {
                            if (v.Url == vvv) {
                                v.Selected = true;
                                return false;
                            }
                        });
                        (function(vv) {
                            $("<img/>") // Make in memory copy of image to avoid css issues
                                .attr("src", vv.Url).load(function() {
                                    vv.Size = this.width + 'x' + this.height;
                                });
                        })(v);
                    });
                    vm.historyRows = data.data;
                }

                $(vm.ctlList.history_page_nav).bootpag({
                    total: data.last_page,
                    maxVisible: 10
                });
            });
        }
    },
    data() {
        return {
            tempValue: [],
            ctlDropzone: null,
            ctlList: {
                history_div: null,
                history_page_nav: null,
                system_div: null,
                system_page_nav: null,
            },
            historyRows: [],
            systemRows: [],
            remoteUrl: '',
            openDialog: false,
        }
    },
    components: {
        'vue-modal': VueModal
    },
    ready() {
        var vm = this;
        Dropzone.autoDiscover = false;
    }
}
</script>
