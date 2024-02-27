<template>

<div class="page">
  <div class="tool-bar flex-jasc">
    <div class="tool-bar-title">{{ pdf_info['Title'] }}</div>
    <div class="tool-bar-operation flex-aic" v-if="pages">
      <el-icon style="margin-right: 10px;" @click="downloadPDF"><Download /></el-icon>
      <el-icon><Printer /></el-icon>
    </div>
  </div> 
  <div class="main flex">
    <div class="main-side">
      <el-tree @node-click="nodeClickHandler" highlight-current :data="catalogs" :props="tree_props" empty-text="暂无目录"></el-tree>
    </div>
    <div class="main-content flex-grow">
      <el-upload drag action="#" :http-request="changeFile" :show-file-list="false"></el-upload>
      <div class="main-content-canvas-container flex-col flex-aic">
        <BasePdfPage v-for="num in pages" :page-num="num" :viewport="viewport" :id="`com-pdf-page-${num}`"></BasePdfPage>
      </div>
    </div>
  </div>
</div>


</template>


<script setup lang="ts">
import { provide, ref } from 'vue'
import * as pdfLib from 'pdfjs-dist'
import BasePdfPage from '@renderer/components/BasePdfPage/index.vue'
import { PDFDocumentProxy } from 'pdfjs-dist/legacy/build/pdf'
import 'pdfjs-dist/legacy/build/pdf.worker.entry'
import { IOutLineNode } from '@renderer/types/global'
// @ts-ignore
pdfLib.GlobalWorkerOptions.workerSrc = window.pdfjsWorker


let file = ref({} as File) 
let pdf_instance = {} as PDFDocumentProxy // pdf文档实例
let catalogs = ref([] as IOutLineNode[]) // 目录
let pages = ref(0) // 总页数
let pdf_info = ref({})
let pdf_doc= ref({})
let viewport = ref({} as pdfLib.PageViewport)
let tree_props = {
  children: 'items',
  label: 'title'
}

provide('pdf_doc', pdf_doc)


async function nodeClickHandler(e: IOutLineNode) {
  let page = await pdf_instance.getPageIndex(e.dest?.[0]) + 1
  // 滚动到第几页
  document.getElementById(`com-pdf-page-${page}`)?.scrollIntoView({behavior: 'instant'})
  // await renderPage(page)
}

// 拖拽文件上传
function changeFile(e: {file: File}) {
  pages.value = 0
  file.value = e.file
  let reader = new FileReader()
  reader.onload = e => {
    init(e.target?.result as ArrayBuffer)
  }
  reader.readAsArrayBuffer(file.value)
}

/**
 * pdf解析器初始化
 * @param arrayBuffer { arrayBuffer } 二进制
 * @returns void
 */
async function init(arrayBuffer: ArrayBuffer) {
  // pdf实例
   pdfLib.getDocument(arrayBuffer).promise.then(async res => {
    pdf_instance = res
    pdf_doc.value = res
    // pdf信息
    let metadata = await pdf_instance.getMetadata()
    pdf_info.value = metadata.info
    await getRenderInfo()
    // 总页码
    pages.value = pdf_instance.numPages
    // 获取目录
    catalogs.value = await pdf_instance.getOutline() || []
    // await renderPage(1)
    // await renderAll()
    
  })
}

/**
 * 渲染pdf一个页码
 * @param pageNum {Number}
 * @returns Promise
 */
async function renderPage(pageNum = 1) {
  return pdf_instance.getPage(pageNum).then(page => {
    let viewport = page.getViewport({scale: 1.3})
    let cvs = document.createElement('canvas')
    cvs.width = viewport.width
    cvs.height = viewport.height
    cvs.className = 'pdf-canvas-item'
    let cvs_ctx = cvs.getContext('2d')
    document.querySelector('.main-content-canvas-container')?.append(cvs)
    
    return page.render({
      canvasContext: cvs_ctx as {},
      viewport,
      background: '#fff',
    }).promise.then(res => {
      console.log('渲染完成::::::::::::::::', res)
    })
  })
}


async function getRenderInfo() {
  return pdf_instance.getPage(1).then(page => {
    viewport.value = page.getViewport({scale: 1.3})
    return page
  })
}

/**
 * 下载pdf
 */
function downloadPDF() {
  pdf_instance.getData().then(data => {
    let blob = new Blob([data.buffer], { type: 'application/pdf' });
    let url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = `${pdf_info.value['Title']}.pdf`;
    a.click();
    a.remove()
  })
}


</script>


<style lang="scss" scoped>
@import './style.scss';
</style>