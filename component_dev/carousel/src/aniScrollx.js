import React from 'react';
const ALLOWANCE = 0.57;
const AniScrollX = {
    handleData({
        loop,
        pageNow
    }, children) {
        const newChildren = React.Children.toArray(children);
        if (loop) {
            const len = children.length;
            const header = React.cloneElement(children[len - 1], {
                extraClass: children[len - 1].props.extraClass ?
                    `${children[len - 1].props.extraClass} extra-item` : 'extra-item',
                key: 0,
                index: len
            });
            const footer = React.cloneElement(children[0], {
                key: -1,
                index: 1
            });
            newChildren.unshift(header);
            newChildren.push(footer);
        }
        return newChildren;
    },
    touchstart() {},
    touchmove({
        touchstartLocation,
        touchmoveLocation,
        pageNow,
        containerDOM,
        width
    }) {
        const translateX = (pageNow - 1) * width + touchstartLocation[0] - touchmoveLocation[0];
        this._addCss({
            dom: containerDOM,
            speed: 0,
            translateX: -translateX,
            reset: true,
            width
        });
    },
    touchend(aniObj) {
        const {
            touchstartLocation,
            touchendLocation,
            pageNow
        } = aniObj;
        const distanceX = touchendLocation[0] - touchstartLocation[0];
        const distanceY = touchendLocation[1] - touchstartLocation[1];
        const tan = Math.abs(distanceX) / Math.abs(distanceY);
        let newpageNow = pageNow;
        if (tan > ALLOWANCE) {
            newpageNow = distanceX > 0 ? pageNow - 1 : pageNow + 1;
        }
        return this.checkAni(aniObj, newpageNow);
    },
    checkAni(aniObj, pageNow) {
        const {
            pagesNum,
            speed,
            containerDOM,
            loop,
            aniSpeed,
            width
        } = aniObj;
        if (this.moving) window.clearInterval(this.moving);
        let translateX = width * (1 - pageNow);
        let newpageNow = pageNow;
        if (pageNow < 1 || pageNow > pagesNum) {
            if (loop) {
                // console.log(`checkAni 延迟处理${pageNow}`);
                this.moving = window.setTimeout(() => {
                    let translate = 0;
                    if (pageNow === 0) {
                        translate = width * (1 - pagesNum);
                    }
                    this._addCss({
                        dom: containerDOM,
                        reset: true,
                        translateX: translate,
                        width
                    });
                    this.moving = null;
                }, (speed + aniSpeed) * 1000);
                newpageNow = pageNow === 0 ? pagesNum : 1;
            } else {
                newpageNow = pageNow < 1 ? 1 : pagesNum;
                translateX = width * (1 - newpageNow);
            }
        }
        this._addCss({
            dom: containerDOM,
            reset: false,
            speed,
            translateX,
            width
        });
        return newpageNow;
    },
    next(aniObj) {
        const {
            pageNow
        } = aniObj;
        const pageNext = pageNow + 1;
        return this.checkAni(aniObj, pageNext);
    },
    prev(aniObj) {
        const {
            pageNow,
            containerDOM,
            speed,
            width
        } = aniObj;
        const pageNext = pageNow - 1;
        const translateX = width * (1 - pageNext);
        this._addCss({
            dom: containerDOM,
            speed,
            translateX
        });
        return this.checkAni(aniObj, pageNext);
    },
    arrive(aniObj, num) {
        if (num >= 1 && num <= aniObj.pagesNum) {
            const translateX = (1 - num) * aniObj.width;
            this._addCss({
                dom: aniObj.containerDOM,
                speed: 0.1,
                translateX,
                reset: true,
                width: aniObj.width
            });
        } else {
            console.log(`传入carousel组建的arrive方法的页面为${num},该值不合法`);
        }
        return num;
    },
    _addCss({
        dom,
        translateX = 0,
        reset,
        ...ani
    }) {
        // 此处为Dom操作
        if (reset) {
            dom.style.webkitTransition = 'none';
            dom.style.transition = 'none';
        } else {
            dom.style.webkitTransition = '';
            dom.style.transition = '';
        }
        dom.style.webkitTransform = `translate(${translateX}px, 0) translateZ(0)`;
        dom.style.transform = `translate(${translateX}px, 0) translateZ(0)`;
    }
};

export default AniScrollX;
