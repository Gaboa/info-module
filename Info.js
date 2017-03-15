export default class Info {
    constructor({
        model,
        game = model.el('game'),
        container = model.group('infoTable'),
        x = game.world.centerX,
        y = game.world.centerY,
        desktopBGScale = 1,
        desktopTableScale = 1,
        mobileBGScale = 1,
        mobileTableScale = 1
    }) {
        this.model = model;
        this.game = game;
        this.container = container;
        this.x = x;
        this.y = y;
        this.desktopBGScale = desktopBGScale;
        this.desktopTableScale = desktopTableScale;
        this.mobileBGScale = mobileBGScale;
        this.mobileTableScale = mobileTableScale;

        this.container.visible = false;
        this.container.alpha = 0;

        this.counter = 1;
        this.model.el('infoCounter', this.counter);

        this.addOverlay();
        this.addBG();
        this.addTable();
        this.addCloseButton();
        this.addControls();

        this.addHandlers();

    }
    addOverlay() {
        this.overlay = this.game.add.graphics(0, 0, this.container)
            .beginFill(0x000000, 0.7)
            .drawRect(0, 0, this.game.width, this.game.height);
        this.model.el('overlay', this.overlay);
    }
    addBG() {
        this.infoTableBg = this.game.add.sprite(this.x, this.y, 'infoTableBg', null, this.container);
        this.infoTableBg.anchor.set(0.5);
        this.infoTableBg.scale.set((this.model.desktop) ? this.desktopBGScale : this.mobileBGScale);
        this.model.el('infoTableBg', this.infoTableBg);
    }
    addTable() {
        this.infoTable = this.game.add.sprite(this.x, this.y, 'infoTable', '1_en.png', this.container);
        this.infoTable.anchor.set(0.5);
        this.infoTable.scale.set((this.model.desktop) ? this.desktopTableScale : this.mobileTableScale);
        this.model.el('infoTable', this.infoTable);
    }
    addCloseButton() {
        this.closeButton = this.game.add.sprite(this.game.width - 170, 120, 'closeButton', null, this.container);
        this.closeButton.right = this.infoTableBg.right + 3;
        this.closeButton.top = (this.model.desktop) ? this.infoTableBg.top + 50 : this.infoTableBg.top + 40;
        this.model.el('closeButton', this.closeButton);
    }
    addControls() {
        this.controls = this.game.add.group();

        this.addMarkers();
        this.addArrows();

        this.controls.y = this.infoTableBg.bottom - this.controls.height / 2 - 20;
        this.controls.x = this.game.width / 2 - this.controls.width / 2 + 50;

        this.container.add(this.controls);
        this.model.group('infoControllers', this.controls);
    }
    addMarkers() {
        this.numberOfInfoImages = this.game.cache._cache.image.infoTable.frameData._frames.length;
        this.infoMarkers = [];

        let infoMarker = this.game.add.sprite(60, 0, 'infoMarker', 'marker_on.png', this.controls);
        infoMarker.anchor.set(0.5);
        infoMarker.name = 'infoMarker0';
        this.infoMarkers.push(infoMarker);

        for (let i = 1; i < this.numberOfInfoImages; i++) {
            let name = 'infoMarker' + i;
            let marker = this.game.add.sprite(infoMarker.x, 0, 'infoMarker', 'marker_off.png', this.controls);
            marker.name = name;
            marker.anchor.set(0.5);
            marker.x = marker.x + 30 * i;
            this.infoMarkers.push(marker);
        }

        this.model.el('infoMarkers', this.infoMarkers);
    }
    addArrows() {
        this.arrowRight = this.game.add.sprite(this.infoMarkers[this.infoMarkers.length - 1].x + 50, 60, 'arrow', null, this.controls);
        this.arrowRight.anchor.set(0.5);
        this.model.el('arrowRight', this.arrowRight);

        this.arrowLeft = this.game.add.sprite(this.infoMarkers[0].x - 50, 60, 'arrow', null, this.controls);
        this.arrowLeft.anchor.set(0.5);
        this.arrowLeft.scale.set(-1, 1);
        this.model.el('arrowLeft', this.arrowLeft);
    }
    addHandlers() {
        this.overlay.inputEnabled = true;
        this.overlay.input.priorityID = 2;
        this.infoTable.inputEnabled = true;
        this.infoTable.input.priorityID = 3;
        this.closeButton.inputEnabled = true;
        this.closeButton.input.priorityID = 4;
        this.arrowRight.inputEnabled = true;
        this.arrowRight.input.priorityID = 4;
        this.arrowLeft.inputEnabled = true;
        this.arrowLeft.input.priorityID = 4;

        this.infoTable.events.onInputDown.add(this.handleTouch, this);
        this.overlay.events.onInputDown.add(this.handleClose, this);
        this.closeButton.events.onInputDown.add(this.handleClose, this);
        this.arrowRight.events.onInputDown.add(this.switchRight, this);
        this.arrowLeft.events.onInputDown.add(this.switchLeft, this);
    }
    handleClose() {
        if (this.model.state('isAnim:info')) return;

        this.game.input.keyboard.enabled = true;
        this.model.state('infoPanelOpen', false);

        this.model.state('isAnim:info', true);
        this.game.add.tween(this.container).to({ alpha: 0 }, 700, 'Quart.easeOut', true)
            .onComplete.add(() => {
                this.model.state('isAnim:info', false);
                this.container.visible = false;
            });
    }
    handleTouch() {
        this.touchX = this.game.input.mouse.input.x;

        let bindedTouchEnd = touchEnd.bind(this);
        function touchEnd() {
            document.removeEventListener('touchend', bindedTouchEnd, false);
            if (this.touchX + 100 < this.game.input.mouse.input.x) {
                this.switchLeft();
            } else if (this.touchX - 100 > this.game.input.mouse.input.x) {
                this.switchRight();
            }
        }

        document.addEventListener('touchend', bindedTouchEnd, false);
    }
    switchRight() {
        this.infoMarkers.forEach((elem) => {
            elem.frameName = 'marker_off.png';
        });

        if (this.counter >= this.numberOfInfoImages) {
            this.counter = 1;
        } else {
            this.counter++;
        }
        this.model.el('infoCounter', this.counter);

        this.infoMarkers[this.counter - 1].frameName = 'marker_on.png';
        this.infoTable.frameName = `${this.counter}_en.png`;
    }
    switchLeft() {
        this.infoMarkers.forEach((elem) => {
            elem.frameName = 'marker_off.png';
        });

        if (this.counter <= 1) {
            this.counter = this.numberOfInfoImages;
        } else {
            this.counter--;
        }
        this.model.el('infoCounter', this.counter);

        this.infoMarkers[this.counter - 1].frameName = 'marker_on.png';
        this.infoTable.frameName = `${this.counter}_en.png`;
    }
    open() {
        if (this.model.state('buttons:locked')
        || this.model.state('roll:progress')
        || this.model.state('isAnim:info')
        || this.model.state('autoplay:start')) return;

        this.model.el('infoCounter', this.counter);
        this.model.state('infoPanelOpen', true);
        // soundController.sound.playSound({ sound: 'buttonClick' });

        this.infoMarkers.forEach((elem) => {
            elem.frameName = 'marker_off.png';
        });
        this.infoMarkers[this.counter - 1].frameName = 'marker_on.png';
        this.infoTable.frameName = `${this.counter}_en.png`;

        this.model.state('isAnim:info', true);
        this.container.visible = true;
        this.game.add.tween(this.container).to({ alpha: 1 }, 700, 'Quart.easeOut', true)
            .onComplete.add(() => {
                this.model.state('isAnim:info', false);
            });
    }
}
