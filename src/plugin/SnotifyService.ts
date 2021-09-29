import mitt from "mitt";
import { SnotifyToast } from "./models/toast.model";
import { ToastDefaults } from "./toastDefaults";
import { SnotifyToastConfig, Snotify, SnotifyDefaults } from "./interfaces";
import { mergeDeep, uuid } from "./utils";
import { SetToastType } from "./decorators/set-toast-type.decorator";
import { TransformArgument } from "./decorators/transform-argument.decorator";
import {SnotifyType} from './types'

export class SnotifyService {
  readonly emitter = mitt();
  notifications: SnotifyToast[] = [];
  config: SnotifyDefaults = ToastDefaults;

  /**
   * emit changes in notifications array
   */
  emit(): void {
    this.emitter.emit("snotify", this.notifications.slice());
  }

  /**
   * returns SnotifyToast object
   * @param id {Number}
   * @return {SnotifyToast|undefined}
   */
  get(id: number): SnotifyToast | undefined {
    return this.notifications.find((toast) => toast.id === id);
  }

  /**
   * add SnotifyToast to notifications array
   * @param toast {SnotifyToast}
   */
  add(toast: SnotifyToast) {
    if (this.config.global?.newOnTop) {
      this.notifications.unshift(toast);
    } else {
      this.notifications.push(toast);
    }
    this.emit();
  }

  /**
   * If ID passed, emits toast animation remove, if ID & REMOVE passed, removes toast from notifications array
   * @param id {number}
   * @param remove {boolean}
   */
  remove(id?: number | string, remove?: boolean): void {
    if (!id) {
      return this.clear();
    } else if (remove) {
      this.notifications = this.notifications.filter(
        (toast) => toast.id !== id
      );
      return this.emit();
    }
    this.emitter.emit("remove", id);
  }

  /**
   * Clear notifications array
   */
  clear(): void {
    this.notifications = [];
    this.emit();
  }

  button(
    text: string,
    closeOnClick: boolean = true,
    action?: (toast?: SnotifyToast) => void,
    bold: boolean = false
  ) {
    return {
      text,
      action: closeOnClick
        ? (toast: SnotifyToast) => {
            if (action) {
              action(toast);
            }
            this.remove(toast.id);
          }
        : action,
      bold,
    };
  }

  /**
   * Creates toast and add it to array, returns toast id
   * @param snotify {Snotify}
   * @return {number}
   */
  create(snotify: Snotify): SnotifyToast | undefined {
    if (this.config?.global?.oneAtTime && this.notifications.length !== 0)
      return;
    if (
      this.config?.global?.preventDuplicates &&
      this.notifications.filter((t) => t.config.type === snotify?.config?.type)
        .length === 1
    )
      return;
    const config = mergeDeep(
      this.config.toast,
      this.config.type ? [snotify.config?.type] : null,
      snotify.config
    ) as SnotifyToastConfig;
    const toast = new SnotifyToast(
      config.id ? config.id : uuid(),
      snotify.title ? snotify.title : "",
      snotify.body ? snotify.body : "",
      config
    );
    this.add(toast);
    return toast;
  }

  setDefaults(defaults: SnotifyDefaults): SnotifyDefaults {
    return (this.config = mergeDeep(this.config, defaults) as SnotifyDefaults);
  }

  /**
   * Create toast with simple style returns toast id;
   * @param body {String}
   * @returns {number}
   */
  simple(body: string): SnotifyToast;
  /**
   * Create toast with simple style returns toast id;
   * @param body {String}
   * @param title {String}
   * @returns {number}
   */
  simple(body: string, title: string): SnotifyToast;
  /**
   * Create toast with simple style returns toast id;
   * @param body {String}
   * @param config {SnotifyToastConfig}
   * @returns {number}
   */
  simple(body: string, config: SnotifyToastConfig): SnotifyToast;
  /**
   * Create toast with simple style  returns toast id;
   * @param [body] {String}
   * @param [title] {String}
   * @param [config] {SnotifyToastConfig}
   * @returns {number}
   */
  simple(body: string, title: string, config: SnotifyToastConfig): SnotifyToast;
  /**
   * Transform toast arguments into {Snotify} object
   */
  @TransformArgument
  /**
   * Determines current toast type and collects default configuration
   */
  @SetToastType
  simple(args: any): SnotifyToast | undefined {
    return this.create(args);
  }

  /**
   * Create toast with success style returns toast id;
   * @param body {String}
   * @returns {number}
   */
  success(body: string): SnotifyToast;
  /**
   * Create toast with success style returns toast id;
   * @param body {String}
   * @param title {String}
   * @returns {number}
   */
  success(body: string, title: string): SnotifyToast;
  /**
   * Create toast with success style returns toast id;
   * @param body {String}
   * @param config {SnotifyToastConfig}
   * @returns {number}
   */
  success(body: string, config: SnotifyToastConfig): SnotifyToast;
  /**
   * Create toast with success style  returns toast id;
   * @param [body] {String}
   * @param [title] {String}
   * @param [config] {SnotifyToastConfig}
   * @returns {number}
   */
  success(
    body: string,
    title: string,
    config: SnotifyToastConfig
  ): SnotifyToast;
  /**
   * Transform toast arguments into {Snotify} object
   */
  @TransformArgument
  /**
   * Determines current toast type and collects default configuration
   */
  @SetToastType
  success(args: any): SnotifyToast | undefined {
    return this.create(args);
  }

  /**
   * Create toast with error style returns toast id;
   * @param body {String}
   * @returns {number}
   */
  error(body: string): SnotifyToast;
  /**
   * Create toast with error style returns toast id;
   * @param body {String}
   * @param title {String}
   * @returns {number}
   */
  error(body: string, title: string): SnotifyToast;
  /**
   * Create toast with error style returns toast id;
   * @param body {String}
   * @param config {SnotifyToastConfig}
   * @returns {number}
   */
  error(body: string, config: SnotifyToastConfig): SnotifyToast;
  /**
   * Create toast with error style  returns toast id;
   * @param [body] {String}
   * @param [title] {String}
   * @param [config] {SnotifyToastConfig}
   * @returns {number}
   */
  error(body: string, title: string, config: SnotifyToastConfig): SnotifyToast;
  /**
   * Transform toast arguments into {Snotify} object
   */
  @TransformArgument
  /**
   * Determines current toast type and collects default configuration
   */
  @SetToastType
  error(args: any): SnotifyToast|undefined {
    console.log('you tried to error');
    return this.create(args);
  }

	  /**
   * Create toast with info style returns toast id;
   * @param body {String}
   * @returns {number}
   */
   info(body: string): SnotifyToast;
  /**
   * Create toast with info style returns toast id;
   * @param body {String}
   * @param title {String}
   * @returns {number}
   */
   info(body: string, title: string): SnotifyToast;
  /**
   * Create toast with info style returns toast id;
   * @param body {String}
   * @param config {SnotifyToastConfig}
   * @returns {number}
   */
   info(body: string, config: SnotifyToastConfig): SnotifyToast;
  /**
   * Create toast with info style  returns toast id;
   * @param [body] {String}
   * @param [title] {String}
   * @param [config] {SnotifyToastConfig}
   * @returns {number}
   */
   info(body: string, title: string, config: SnotifyToastConfig): SnotifyToast;
  /**
   * Transform toast arguments into {Snotify} object
   */
  @TransformArgument
  /**
   * Determines current toast type and collects default configuration
   */
  @SetToastType
   info(args: any): SnotifyToast|undefined {
    return this.create(args);
  }

	  /**
   * Create toast with warning style returns toast id;
   * @param body {String}
   * @returns {number}
   */
   warning(body: string): SnotifyToast;
  /**
   * Create toast with warning style returns toast id;
   * @param body {String}
   * @param title {String}
   * @returns {number}
   */
   warning(body: string, title: string): SnotifyToast;
  /**
   * Create toast with warning style returns toast id;
   * @param body {String}
   * @param config {SnotifyToastConfig}
   * @returns {number}
   */
   warning(body: string, config: SnotifyToastConfig): SnotifyToast;
  /**
   * Create toast with warning style  returns toast id;
   * @param [body] {String}
   * @param [title] {String}
   * @param [config] {SnotifyToastConfig}
   * @returns {number}
   */
   warning(body: string, title: string, config: SnotifyToastConfig): SnotifyToast;
  /**
   * Transform toast arguments into {Snotify} object
   */
  @TransformArgument
  /**
   * Determines current toast type and collects default configuration
   */
  @SetToastType
   warning(args: any): SnotifyToast|undefined {
    return this.create(args);
  }
	  /**
   * Create toast with confirm style returns toast id;
   * @param body {String}
   * @returns {number}
   */
   confirm(body: string): SnotifyToast;
  /**
   * Create toast with confirm style returns toast id;
   * @param body {String}
   * @param title {String}
   * @returns {number}
   */
   confirm(body: string, title: string): SnotifyToast;
  /**
   * Create toast with confirm style returns toast id;
   * @param body {String}
   * @param config {SnotifyToastConfig}
   * @returns {number}
   */
   confirm(body: string, config: SnotifyToastConfig): SnotifyToast;
  /**
   * Create toast with confirm style  returns toast id;
   * @param [body] {String}
   * @param [title] {String}
   * @param [config] {SnotifyToastConfig}
   * @returns {number}
   */
   confirm(body: string, title: string, config: SnotifyToastConfig): SnotifyToast;
  /**
   * Transform toast arguments into {Snotify} object
   */
  @TransformArgument
  /**
   * Determines current toast type and collects default configuration
   */
  @SetToastType
   confirm(args: any): SnotifyToast|undefined {
    return this.create(args);
  }
	/**
   * Create toast with Prompt style {with two buttons}, returns toast id;
   * @param body {String}
   * @returns {number}
   */
   prompt(body: string): SnotifyToast;
  /**
   * Create toast with Prompt style {with two buttons}, returns toast id;
   * @param body {String}
   * @param title {String}
   * @returns {number}
   */
   prompt(body: string, title: string): SnotifyToast;
  /**
   * Create toast with Prompt style {with two buttons}, returns toast id;
   * @param body {String}
   * @param config {SnotifyToastConfig}
   * @returns {number}
   */
   prompt(body: string, config: SnotifyToastConfig): SnotifyToast;
  /**
   * Create toast with Prompt style {with two buttons}, returns toast id;
   * @param [body] {String}
   * @param [title] {String}
   * @param [config] {SnotifyToastConfig}
   * @returns {number}
   */
   prompt(body: string, title: string, config: SnotifyToastConfig): SnotifyToast;
  /**
   * Transform toast arguments into {Snotify} object
   */
  @TransformArgument
  /**
   * Determines current toast type and collects default configuration
   */
  @SetToastType
   prompt(args: any): SnotifyToast|undefined {
    return this.create(args);
  }

	//  mergeToast(toast, next, type?: SnotifyType) {
  //   if (next.body) {
  //     toast.body = next.body;
  //   }
  //   if (next.title) {
  //     toast.title = next.title;
  //   }
  //   if (type && this.config.toast) {
  //     toast.config = mergeDeep(toast.config, this.config.global, this.config.toast[type], {type}, next.config);
  //   } else {
  //     toast.config = mergeDeep(toast.config, next.config);
  //   }
  //   if (next.html) {
  //     toast.config.html = next.html;
  //   }
  //   this.emit();
  //   this.emitter.emit('toastChanged', toast);
  // }

	  /**
   * Creates empty toast with html string inside
   * @param {string} html
   * @param {SnotifyToastConfig} config
   * @returns {number}
   */
  //  html(html: string, config?: SnotifyToastConfig): SnotifyToast {
  //   return this.create({
  //     title: undefined,
  //     body: undefined,
  //     config: {
  //       ...config,
  //       ...{html}
  //     }
  //   });
  // }
}
