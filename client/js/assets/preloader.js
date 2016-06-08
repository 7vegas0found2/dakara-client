/**
 * Created by horacio on 3/22/16.
 */

define(['lib/howler', 'lib/pixi'],
    function (Howler, PIXI) {

        class Preloader {
            constructor(assetManager) {
                this.assetManager = assetManager;
                this.PRELOAD_GRHS = [];
                this.PRELOAD_MAPAS = [];
            }

            _loadSounds() {
                for (var i = 1; i < 212; i++) { // <-- todo numero hardcodeado!
                    if (!this.assetManager.audio.sounds[i]) {
                        this.assetManager.audio.sounds[i] = new Howl({
                            urls: ['audio/sonidos/' + i + '.m4a']
                        })
                    }
                }

                log.info("Sonidos cargados!");
            }

            copiarLoadedAssets(resources, baseTextures, mapas) {
                for (var res in resources) {
                    if (res.slice(0, 4) === "mapa") {
                        var numero = res.slice(4, res.length);
                        mapas[parseInt(numero)] = resources[res].data;
                    }
                    else { //numero, es un grafico
                        baseTextures[parseInt(res)] = resources[res].texture.baseTexture;
                    }
                }
            }

            _agregarPreloadGrhs(loader, indices) {
                var graficos = [];
                for (var i = 0; i < this.PRELOAD_GRHS.length; i++) {
                    var grh = this.PRELOAD_GRHS[i];
                    if (!indices[grh].grafico) { // animacion
                        continue;
                    }
                    var numGrafico = indices[grh].grafico;
                    if (graficos[numGrafico]) { // ya puesto a cargar
                        continue;
                    }
                    graficos[numGrafico] = 1;
                    loader.add(numGrafico + "", "graficos/" + numGrafico + ".png");
                }
            }

            _agregarPreloadMapas(loader) { // TODO: comprimir los mapas con http://pieroxy.net/blog/pages/lz-string/index.html y guardarlos en el local storage ??
                for (var i = 0; i < this.PRELOAD_MAPAS.length; i++) {
                    loader.add("mapa" + this.PRELOAD_MAPAS[i], "mapas/mapa" + this.PRELOAD_MAPAS[i] + ".json");
                }
            }

            _initGrhsPreload() {
                for (var i = 0; i < this.PRELOAD_GRHS.length; i++) {
                    this.assetManager.loadGrh(this.PRELOAD_GRHS[i]);
                }
            }

            _onGrhsLoaded() {
                this._initGrhsPreload();
            }

            preload(terminar_callback) {
                //this._loadSounds();

                if ((this.PRELOAD_GRHS.length < 1) || (this.PRELOAD_MAPAS.length < 1)) { // no hay nada que cargar
                    terminar_callback();
                    return;
                }

                var loader = PIXI.loader;
                this._agregarPreloadMapas(loader);
                this._agregarPreloadGrhs(loader, this.assetManager.indices);

                var self = this;

                loader.on('progress', function (loader, loadedResource) {
                    console.log('Progress:', loader.progress + '%');
                });

                loader.load(function (loader, resources) {
                    self.copiarLoadedAssets(loader.resources, self.assetManager._baseTextures, self.assetManager.dataMapas);
                    self._onGrhsLoaded();
                    PIXI.loader.reset();
                    terminar_callback();
                });
            }

            preloadAll(terminar_callback) {
                var maxMapa = 312;
                for (var i = 1; i <= maxMapa; i++) {
                    this.PRELOAD_MAPAS.push(i);
                }
                for (var i = 0; i < this.assetManager.indices.length; i++) {
                    if (this.assetManager.indices[i])
                        this.PRELOAD_GRHS.push(i);
                }
                this.preload(terminar_callback);
            }
        }

        return Preloader;
    });