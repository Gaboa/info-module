import { model } from '../markup/modules/Model/Model';

export let controller = (() => {

    const volume = {

        changeVolume: function (value) {
            let game = model.el('game');
            game.sound.volume = value / 100;
        },

        switchVolume: function () {
            let game = model.el('game');
            if (game.sound.volume > 0) {
                game.sound.volume = 0;
                model.state('globalSound', false);
                model.cookie('globalSound', false);
            } else {
                game.sound.volume = volume.getVolume();
                model.state('globalSound', true);
                model.cookie('globalSound', true);
            }
        },

        getVolume: function () {
            return this.value || 1;
        },

        setVolume: function (value) {
            this.value = value / 100;
        }
    };

    const sound = {

        playSound: function ({
            sound,
            duration = 0,
            fade = 0,
            volume = 1,
            //loop добавлен на будущее
            loop = false
        }) {
            let game = model.el('game');
            if (!model.sound(sound)) {
                model.sound(sound, game.add.audio(sound, volume, false));
            }

            if (!model.state('sound')) {
                return;
            }
            // this will remove multiplier clicking sounds
            // if(!model.sound(sound).isPlaying){
            //     model.sound(sound).play();
            // };
            if (fade > 0) {
                model.sound(sound).fadeIn(fade);
            } else {
                model.sound(sound).play();
            }

            if (duration > 0) {
                setTimeout(() => {
                    model.sound(sound).stop();
                }, duration);
            }
        },

        stopSound: function (sound) {
            if (!model.state('sound') || typeof model.sound(sound) == 'undefined') {
                return;
            }
            model.sound(sound).stop();
        },

        changeSoundVolume: function (sound, value) {
            model.sound(sound).volume = value / 100;
        }

    };

    const music = {

        playMusic: function(music, volume = 1){
            let game = model.el('game');
            if (!model.sound(music)){
                model.sound(music, game.add.audio(music, volume, true));
            }

            if (!model.state('music')) {
                return;
            }
            let currMusic = model.sound(music);
            // if(currMusic.paused){
            if (currMusic.mute) {
                model.sound(music).mute = false;
                // currMusic.restart();
            } else {
                if (currMusic.isDecoded) {
                    currMusic.fadeIn(3000, true);
                } else {
                    currMusic.onDecoded.add(() => {
                        currMusic.fadeIn(3000, true);
                    });
                }
            }
        },

        stopMusic: function (music) {
            if (!model.state('music') || typeof model.sound(music) == 'undefined') {
                return;
            }
            model.sound(music).fadeOut(2000);
        },

        pauseMusic: function(music) {
            // model.sound(music).pause();
            model.sound(music).mute = true;
        },

        changeMusicVolume: function(music, value) {
            model.sound(music).volume = value;
        }
    };

    return {
        sound,
        music,
        volume
    };

})();
