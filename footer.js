export default class Footer {
    constructor({
        model,
        request,
        soundController,
        game = model.el('game'),
        mainContainer = model.group('footer'),
        menuContainer = model.group('footerMenu')
    }) {
        this.model = model;
        this.reuest = request;
        this.soundController = soundController;
        this.game = game;
        this.mainContainer = mainContainer;
        this.menuContainer = menuContainer;
        this.buttonY = this.game.height - 20;
        this.topFooterHeight = 35;
        this.bottomFooterHeight = 40;
    }

    addTopFooter(color = 0x000000, alpha = 0.6) {
        this.footerTop = this.game.add.graphics(0, 0, this.mainContainer)
            .beginFill(color, alpha).drawRect(
                0,
                this.game.height - (this.bottomFooterHeight + this.topFooterHeight),
                this.game.width,
                this.footerHeight
            );

        this.model.el('footerTop', this.footerTop);
        this.model.data('footerTopCenterY', this.game.height - (this.bottomFooterHeight + this.topFooterHeight / 2));
    }

    addBottomFooter(color = 0x000000, alpha = 0.85) {
        this.footerBottom = this.game.add.graphics(0, 0, this.mainContainer)
            .beginFill(color, alpha).drawRect(
                0,
                this.game.height - this.bottomFooterHeight,
                this.game.width,
                this.bottomFooterHeight
            );

        this.model.el('footerBottom', this.footerBottom);
        this.model.data('footerBottomCenterY', this.game.height - (this.bottomFooterHeight / 2));
    }

    addHome(x, y) {
        this.homeButton = this.game.add.button(
            x,
            y,
            'footerButtons',
            null, null, null,
            'home.png',
            null, null,
            this.menuContainer);
        this.homeButton.anchor.set(0.5);

        this.model.el('homeButton', this.homeButton);
    }

    addFullScreen(x, y) {
        this.fullScreenButton = this.game.add.button(
            x,
            y,
            'footerButtons',
            null, null, null,
            'fullScreenOn.png',
            null, null,
            this.menuContainer);
        this.fullScreenButton.anchor.set(0.5);

        this.model.el('fullScreenButton', this.fullScreenButton);
    }

    addSound(x, y) {
        this.soundButton = this.game.add.button(
            x,
            y,
            'footerButtons',
            null, null, null,
            'soundOn.png',
            null, null,
            this.menuContainer);
        this.soundButton.anchor.set(0.5);

        this.model.el('soundButton', this.soundButton);
    }

    addFast(x, y) {
        this.fastButton = this.game.add.button(
            x,
            y,
            'footerButtons',
            null, null, null,
            'fastSpinOff.png',
            null, null,
            this.menuContainer);
        this.fastButton.anchor.set(0.5);

        this.model.el('fastButton', this.fastButton);
    }

    addSettings(x, y) {
        this.settingsButton = this.game.add.button(
            x,
            y,
            'footerButtons',
            null, null, null,
            'settings.png',
            null, null,
            this.menuContainer);
        this.settingsButton.anchor.set(0.5);

        this.model.el('settingsButton', this.settingsButton);
    }

    addTime() {
        this.timeStyle = {font: '22px Helvetica, Arial', align: 'center', fill: '#fff'};
        this.timeHeight = (this.model.desktop) ? this.game.height - 17 : this.game.height - 11;
        this.currentHour = new Date().getHours();
        this.currentMinutes = new Date().getMinutes();

        if (this.currentHour < 10) {
            this.currentHour = `0${this.currentHour}`;
        }
        if (this.currentMinutes < 10) {
            this.currentMinutes = `0${this.currentMinutes}`;
        }


        this.footerTime = this.game.add.text(
            0,
            this.timeHeight,
            `${this.currentHour} : ${this.currentMinutes}`,
            this.timeStyle,
            this.mainContainer);
        this.footerTime.anchor.set(0.5);
        this.footerTime.x = this.game.width - this.footerTime.width;

        this.model.el('footerTime', this.footerTime);
    }

    handleDarkness() {
        // Включаем управление с клавиатуры
        this.game.input.keyboard.enabled = true;
        $('#settings').addClass('closed');
        $('#darkness').addClass('closed');
        $('.history').addClass('closed');
        $('#darkness').off();
    }

    handleSettings() {
        if (this.model.state('buttons:locked')
        || this.model.state('roll:progress')
        || this.model.state('autoplay:start')) {
            return;
        }

        // Выключаем управление с клавиатуры
        this.game.input.keyboard.enabled = false;

        // костыль на баг с зависанием кнопки после открытия области поверъ нее
        this.settingsButton.scale.set(1);

        // Обновляем состояния чекбоксов в настройках
        $('#volume').prop('value', (this.model.state('globalSound')) ? this.soundController.volume.getVolume() * 100 : 0);
        $('#checkSound').prop('checked', this.model.state('sound'));
        $('#checkMusic').prop('checked', this.model.state('music'));
        $('#fastSpin').prop('checked', this.model.state('fastRoll'));
        $('#isAnimBG').prop('checked', this.model.state('isAnimBG'));
        $('#optionAutoplay4').prop('checked', this.model.state('autoStopWhenFS'));
        $('#optionAutoplay5').prop('checked', this.model.state('autoTransititon'));

        // Открываем настройки
        $('#settings').removeClass('closed');
        $('#darkness').removeClass('closed');

        // при клике на оверлей закрываем настройки
        $('#darkness').on('click', this.handleDarkness.bind(this));
    }

    handleSound() {
        if (this.model.state('globalSound')) {
            this.soundController.volume.switchVolume();
        } else {
            this.soundController.volume.switchVolume();
        }
    }

    handleFast() {
        if (this.model.state('fastRoll')) {
            this.model.state('fastRoll', false);
            this.model.cookie('fastRoll', false);
        } else {
            this.model.state('fastRoll', true);
            this.model.cookie('fastRoll', true);
        }
    }

    handleHome() {
        // Отправляем запрос Logout
        this.request.send('Logout')
            .then((response) => {
                // Возвращаемся на предыдущую страницу
                window.history.back();
                console.log('Logout response:', response);
            });
    }

    handleFullScreen() {
        if (this.game.scale.isFullScreen) {
            this.game.scale.stopFullScreen();
        } else {
            this.game.scale.startFullScreen();
        }
    }

    initMainDesktop() {
        this.addBottomFooter();
        this.addTime();

        this.addHome(30, this.buttonY);
        this.homeButton.onInputDown.add(this.handleHome, this);

        this.addSettings(80, this.buttonY);
        this.settingsButton.onInputDown.add(this.handleSettings, this);

        this.addSound(130, this.buttonY);
        this.soundButton.onInputDown.add(this.handleSound, this);

        this.addFast(180, this.buttonY);
        this.fastButton.onInputDown.add(this.handleFast, this);

        this.addFullScreen(230, this.buttonY);
        this.fullScreenButton.onInputDown.add(this.handleFullScreen, this);

        this.menuContainer.children.forEach((button) => {
            button.onInputOver.add(() => {
                button.scale.set(1.4);
            });
            button.onInputOut.add(() => {
                button.scale.set(1);
            });
        });

        this.mainContainer.add(this.menuContainer);
    }

    initFsDesktop() {
        this.addBottomFooter();
        this.addTime();

        this.addHome(30, this.buttonY);
        this.homeButton.onInputDown.add(this.handleHome, this);

        this.addSound(80, this.buttonY);
        this.soundButton.onInputDown.add(this.handleSound, this);

        this.addFast(130, this.buttonY);
        this.fastButton.onInputDown.add(this.handleFast, this);

        this.addFullScreen(180, this.buttonY);
        this.fullScreenButton.onInputDown.add(this.handleFullScreen, this);

        this.menuContainer.children.forEach((button) => {
            button.onInputOver.add(() => {
                button.scale.set(1.4);
            });
            button.onInputOut.add(() => {
                button.scale.set(1);
            });
        });

        this.mainContainer.add(this.menuContainer);
    }

    initMobile() {
        this.addBottomFooter();
        this.addTopFooter();
        this.addTime();

        this.addHome(30, this.buttonY);
        this.homeButton.onInputDown.add(this.handleHome, this);

        this.mainContainer.add(this.menuContainer);
    }

    updateTime() {
        this.hours = new Date().getHours();
        this.minutes = new Date().getMinutes();

        if (this.hours < 10) {
            this.hours = `0${this.hours}`;
        }
        if (this.minutes < 10) {
            this.minutes = `0${this.minutes}`;
        }

        if (this.currentHour !== this.hours) {
            this.currentHour = this.hours;
            this.footerTime.text = `${this.currentHour} : ${this.currentMinutes}`;
        }

        if (this.currentMinutes !== this.minutes) {
            this.currentMinutes = this.minutes;
            this.footerTime.text = `${this.currentHour} : ${this.currentMinutes}`;
        }
    }

    updateFrame() {
        if (this.model.desktop) {
            this.fullScreenButton.frameName = (this.game.scale.isFullScreen || window.innerHeight === screen.height) ? 'fullScreenOff.png' : 'fullScreenOn.png';
            this.soundButton.frameName = (this.model.state('globalSound')) ? 'soundOn.png' : 'soundOff.png';
            this.fastButton.frameName = (this.model.state('fastRoll')) ? 'fastSpinOn.png' : 'fastSpinOff.png';
        }
    }

    update() {
        this.updateTime();
        this.updateFrame();
    }
}
