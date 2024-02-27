<template>
    <div ref="pageRef" style="margin-bottom: 10px;"></div>
</template>



<script setup lang="ts">
import { ref, onMounted, inject, toRaw, Ref } from 'vue'
import { useIntersectionObserver } from '@renderer/hooks/useIntersectionObserver'
import { PDFDocumentProxy, PageViewport } from 'pdfjs-dist';
import { TextLayerBuilder } from 'pdfjs-dist/web/pdf_viewer'
import 'pdfjs-dist/web/pdf_viewer.css'
import { PDFPageProxy } from 'pdfjs-dist/types/src/display/api';

interface IProps {
  pageNum: number,
  viewport: PageViewport
}

let props = defineProps<IProps>()

let pageRef = ref({} as Element)
let canvas_dom = ref({} as HTMLCanvasElement)

let pdf_instance = toRaw((inject('pdf_doc') as Ref).value as PDFDocumentProxy)


onMounted(() => {


  canvas_dom.value = document.createElement('canvas')
  canvas_dom.value.width = props.viewport.width
  canvas_dom.value.height = props.viewport.height
  pageRef.value.append(canvas_dom.value)



  let observer = useIntersectionObserver(canvas_dom.value, (entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting) {
        console.log(`开始渲染第${props.pageNum}页`);
        renderPage()
        observer.unobserve(canvas_dom.value)
      }
    });
  })
})



async function renderPage(pageNum = props.pageNum) {
  return pdf_instance.getPage(pageNum).then((page: PDFPageProxy) => {
    let viewport = page.getViewport({scale: 1.3})
    let cvs_ctx = canvas_dom.value.getContext('2d')
    
    return page.render({
      canvasContext: cvs_ctx as {},
      viewport,
      background: '#eee',
    }).promise.then(() => {
      console.log(`第${props.pageNum}渲染完成`)
      return page.getTextContent()
    }).then(textContent => {
      // 渲染文本节点
      // console.log(textContent)

      // let layer = new TextLayerBuilder({
      //   eventBus: null,
      //   pageIndex: page._pageIndex,
      //   textLayerDiv: document.createElement('div'),
      //   viewport: props.viewport
      // })

      // layer.setTextContent(textContent)
      // layer.render()

      return textContent
    })

  })
}

</script>