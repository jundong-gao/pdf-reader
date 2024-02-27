

export function useIntersectionObserver(dom: Element, callback: IntersectionObserverCallback) {
    let observer = new IntersectionObserver(callback, {
        threshold: 0
    })
    observer.observe(dom)

    return observer
}