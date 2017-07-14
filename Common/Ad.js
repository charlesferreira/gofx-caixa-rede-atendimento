var Ad = function(options) {
    this.setup(options, {
        width: 300,
        height: 250,
        teaseWidth: 25,
        autoPlayTimeOut: 5000,
        autoPlayMaxTimeOut: 20000,
        slideLeftMaxDuration: 800,
        slideRightMaxDuration: 1500,
        transitions: {
            tease: 'all 0.3s ease-in-out',
            txtTemFadeIn: 'all 1.0s ease-out 0.2s',
            dragLabelFadeOut: 'all 0.3s ease-out',
            dragLabelFadeIn: 'all 0.4s ease-in 0.1s',
            dragFadeOut: 'all 0.75s ease 2.5s',
            txtFinalFadeIn: 'all 0.5s ease 3.0s',
            txtFinalFadeOut: 'all 0.5s ease 5.8s',
            logoFadeIn: 'all 0.5s ease 6.1s',
        },
    }).update();
}

Ad.prototype.update = function() {
    requestAnimationFrame(this.update.bind(this));
    var transform = window.getComputedStyle(document.getElementById('x')).transform;
    this.dragX = transform == 'none' ? 0 : transform.match(/([-+]?[\d\.]+)/g)[4];
    var maskX = Math.round(this.width - this.dragX);
    this.style('drag', { transform: 'translateX('+Math.round(this.dragX)+'px)'});
    this.style('drag-mask', { 'background-position': maskX + 'px center' });
}

Ad.prototype.setup = function(options, defaultOptions) {
    for (var i in defaultOptions) this[i] = options[i] || defaultOptions[i];
    return this
        .hide('txt-tem')
        .hide('txt-final')
        .hide('logo')
        .setupAutoPlay();
}

Ad.prototype.setupAutoPlay = function() {
    setTimeout(function() {
        if (!this.isAutoPlaying)
            this.autoPlay();
    }.bind(this), this.autoPlayMaxTimeOut);
    return this.resetAutoPlay();
}

Ad.prototype.resetAutoPlay = function() {
    if (this.autoPlayTimeOutId) clearTimeout(this.autoPlayTimeOutId);
    this.autoPlayTimeOutId = setTimeout(this.autoPlay.bind(this), this.autoPlayTimeOut);
    return this;
}

Ad.prototype.autoPlay = function() {
    this.completeSlide(true);
    return this;
}

Ad.prototype.hide = function(id, transition) {
    return this.style(id, { opacity: 0 }, transition);
}

Ad.prototype.show = function(id, transition) {
    return this.style(id, { opacity: 1 }, transition);
}

Ad.prototype.style = function(id, styles, transition) {
    gwd.actions.events.setInlineStyle(id, this.flatten(styles, {
        transition: transition || 'all 0s linear'
    }));
    return this;
}

Ad.prototype.flatten = function(values, extras) {
    var arr = [];
    for (var i in values) arr.push(i + ':' + values[i]);
    for (var i in extras) arr.push(i + ':' + extras[i]);
    return arr.join(';');
}

Ad.prototype.cta = function() {
    if (this.isDragging) return false;
    console.log('CTA');
}

Ad.prototype.onDragStart = function(event) {
    if (this.isAutoPlaying) return;
    this.dragStarted = true;
    this.hide('drag-label', this.transitions.dragLabelFadeOut);
    this.isTeasing = false;
    this.startX = event.clientX;
}

Ad.prototype.onDragFinish = function(event) {
    if (this.isAutoPlaying) return;
    this.completeSlide();
}

Ad.prototype.onDragUpdate = function(event) {
    if (this.isAutoPlaying) return;

    if (this.dragStarted && !this.isDragging)
        this.isDragging = true;

    if (this.isDragging) {
        this.resetAutoPlay();
        var x = event.clientX - this.startX + this.teaseWidth;
        if (x < 0) {
            x = 0;
            this.startX = event.clientX + this.teaseWidth;
        }
        this.style('x', {transform: 'translateX(' + x + 'px)'});
    }
}

Ad.prototype.onTeaseOver = function() {
    if (this.isAutoPlaying) return;
    this.isTeasing = true;
    this.style('x', { transform: 'translateX(' + this.teaseWidth + 'px)' }, this.transitions.tease);
}

Ad.prototype.onTeaseOut = function() {
    if (this.isAutoPlaying || !this.isTeasing) return;
    this.isTeasing = false;
    this.style('x', { transform: 'translateX(0px)' }, this.transitions.tease);
}

Ad.prototype.completeSlide = function(forceFinal) {
    this.isAutoPlaying = true;
    var mid = this.width / 2;
    var x = (this.dragX > mid || forceFinal) ? this.width : 0;
    var maxDuration = x == 0 ? this.slideLeftMaxDuration : this.slideRightMaxDuration;
    var duration = forceFinal && this.dragX < mid
        ? maxDuration
        : Math.round(maxDuration * (1 - Math.abs(mid - this.dragX) / (mid)));

    var transition = 'all ' + duration + 'ms ease-in-out';
    this.style('x', { transform: 'translateX(' + x + 'px)' }, transition);

    if (x == 0)
        this.show('drag-label', this.transitions.dragLabelFadeIn)

    setTimeout(function() {
        if (x == 0) {
            this.isAutoPlaying= false;
        } else {
            this.playLastFrame();
        }
    }.bind(this), duration + 50);

    setTimeout(function() {
        this.dragStarted = false;
        this.isDragging = false;
    }.bind(this), 100);
}

Ad.prototype.playLastFrame = function() {
    this.hide('img-before')
        .show('txt-tem', this.transitions.txtTemFadeIn)
        .hide('drag', this.transitions.dragFadeOut)
        .show('txt-final', this.transitions.txtFinalFadeIn)
        .hide('txt-final-wrap', this.transitions.txtFinalFadeOut)
        .show('logo', this.transitions.logoFadeIn)
}