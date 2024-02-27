<template>
    <button class="bg-red-600" @click="renderPage(2)">渲染</button>
    <canvas id="pdf-canvas"></canvas>
  </template>
    
    
    
    <script setup lang="ts">
    import * as pdfLib from 'pdfjs-dist'
    import { PDFDocumentProxy } from 'pdfjs-dist/legacy/build/pdf'
    import { PDFLinkService } from 'pdfjs-dist/web/pdf_viewer'
    import 'pdfjs-dist/legacy/build/pdf.worker.entry'
    import pdf_src from '@renderer/assets/simple.pdf'
    import { IOutLineNode } from '@renderer/types/global'
    // @ts-ignore
    pdfLib.GlobalWorkerOptions.workerSrc = window.pdfjsWorker
    
    let pdf_instance = {} as PDFDocumentProxy // pdf文档实例
    let catalogs = [] as IOutLineNode[] // 目录
    let link_instance = {} as ReturnType<() => PDFLinkService>
    
    
    console.log('pdf_instance::::::::::::::::', pdf_instance)
    
    
    async function init() {
      pdf_instance = await pdfLib.getDocument(pdf_src).promise
      catalogs = await pdf_instance.getOutline() // 获取目录
      link_instance = new PDFLinkService() // 链接实例
      link_instance.setDocument(pdf_instance) // 设置pdf
    }
    
    async function renderPage(pageNum = 1) {
      pdf_instance.getPage(pageNum).then(page => {
        let viewport = page.getViewport({scale: 1.3})
        let cvs = document.getElementById('pdf-canvas') as HTMLCanvasElement
        cvs.width = viewport.width
        cvs.height = viewport.height
        let cvs_ctx = cvs.getContext('2d')
        
        page.render({
          canvasContext: cvs_ctx as {},
          viewport,
          background: '#eee',
        }).promise.then(res => {
          console.log('渲染完成::::::::::::::::', res)
        })
      })
    }
    
    
    
    init()
    
    
    
    </script>