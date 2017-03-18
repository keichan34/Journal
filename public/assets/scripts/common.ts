// import required modules via npm
import * as $ from 'jquery';

// import custom typing definitions
import * as Types from '../../../resources/types/types.d';

// import functions via scripts resources
import * as Enums from "../../../resources/scripts/_enums";
import * as Helpers from "../../../resources/scripts/_helpers";
import * as Actions from "../../../resources/scripts/_actions";


class InitializeApp {
  private durations: Types.Durations;
  constructor() {
    this.initializeVariables();
    this.initializeLayout();
  }

  private initializeVariables(): void {
    this.durations = {
      normal: 300,
      appearance: 450,
      animation: 900
    };
  }

  private initializeLayout(): void {
    this.toggleSideNavigation();
    this.posiotioningPanes();
    this.insertArrowToMenu();
    this.adjustAppearanceOfFormFields();
  }

  private toggleSideNavigation(): void {
    const $navigation: JQuery = $('#jsi-jnl-navigation');
    const $toggleTrigger: JQuery = $('#jsi-jnl-navigation__trigger');
    const defaultClassName: string = 'jnl-navigation';
    const openedClassName: string = 'jnl-navigation--opened';

    $toggleTrigger.click(() => {
      $navigation
        .toggleClass(defaultClassName)
        .toggleClass(openedClassName);
    });
  }

  private insertArrowToMenu(): void {
    const $lists: JQuery = $('.jsc-jnl-layout__contents__pages__list');
    const $rightArrow: string = `<i class="jnl-icon">keyboard_arrow_right</i>`;

    $lists.each(function() {
      $(this).find('a').append($rightArrow);
    });
  }

  private adjustAppearanceOfFormFields(): void {
    const $checkboxes: JQuery = $('.jsc-jnl-formfield__checkbox');
    const $radios: JQuery = $('.jsc-jnl-formfield__radio');
    const activeClassName: string = 'is-active';

    const $appearance = (target: string) => `
      <span class="jnl-formfield__${target}__background jsc-jnl-formfield__${target}__background">
        <span class="jnl-formfield__${target}__appearance${target === 'checkbox' ? ' jnl-icon' : ''}">
          ${target === 'checkbox' ? 'check' : ''}
        </span>
      </span>
    `;

    $checkboxes.each(function() {
      $(this).find('input').after($appearance('checkbox'));
    });

    $checkboxes.click(function() {
      if ( $(this).find('input').prop('checked') ) {
        $(this).find('.jsc-jnl-formfield__checkbox__background').addClass(activeClassName);
      } else {
        $(this).find('.jsc-jnl-formfield__checkbox__background').removeClass(activeClassName);
      }
    });

    $radios.each(function() {
      $(this).find('input').after($appearance('radio'));
    });

    $radios.click(function() {
      if ( $(this).find('input').prop('checked') ) {
        $(this).find('.jsc-jnl-formfield__radio__background').addClass(activeClassName);
      } else {
        $(this).find('.jsc-jnl-formfield__radio__background').removeClass(activeClassName);
      }
    });
  }

  private isPaneShown(pane: JQuery): boolean {
    const windowWidth: number = $(window).width();
    const navigationWidth: number = $('#jsi-jnl-navigation').innerWidth();

    return parseInt(pane.css('left'), 10) != windowWidth - navigationWidth;
  }

  private posiotioningPanes(): void {
    const _this: any = this;
    const $main: JQuery = $('#jsi-jnl-layout__contents');
    const $paneLinks: JQuery = $('a[data-pane-href]');
    const $panes: JQuery = $main.children();
    const $paneHeaders: JQuery = $('.jsc-layout__pane__headline');
    const windowWidth: number = $(window).width();
    const navigation: JQuery = $('#jsi-jnl-navigation');
    const paneCloseClassName: string = 'jsc-jnl-layout__pane__headline__close';

    /**
     * initialize first pane position
    **/
    $panes.eq(0).css({
      left: 0
    });

    /**
     * add closing button to panes which is >= second
    **/
    $paneHeaders.each(function() {
      const $closingButton: string = `<i class="jnl-icon ${paneCloseClassName}">close</i>`;

      $(this).prepend($closingButton);
      $(this).css({ 'padding-left': '50px' });
    });

    /**
     * activate close button function
    **/
    $(`.${paneCloseClassName}`).click(function() {
      $(this).closest('.jsc-jnl-layout__pane').css({
        left: '100%'
      });

      $(this).closest('.jsc-jnl-layout__pane').nextAll('.jsc-jnl-layout__pane').css({
        left: '100%'
      });

      setTimeout(() => {
        _this.adjustPanePosition();
      }, _this.durations.animation);
    });

    /**
     * activate click and go
    **/
    $paneLinks.click(function() {
      const $_this: JQuery = $(this);
      const $parent: JQuery = $_this.closest('.jsc-jnl-layout__pane');
      const targetPaneName: string = $_this.data('pane-href');

      $panes.each(function() {
        if (
          $(this).data('pane-target') === targetPaneName &&
          parseInt($(this).css('left'), 10) === windowWidth - navigation.innerWidth()
        ) {
          $(this).css({
            left: parseInt($parent.css('left'), 10) + $parent.innerWidth()
          });

          setTimeout(() => {
            _this.adjustPanePosition()
          }, _this.durations.animation);
        }
      });
    });
  }

  private adjustPanePosition(): void {
  //   TODO: WIP...
  //   const _this: any = this;
  //   const $main: JQuery = $('#jsi-jnl-layout__contents');
  //   const $paneLinks: JQuery = $('a[data-pane-href]');
  //   const $panes: JQuery = $main.children();
  //   const windowWidth: number = $(window).width();
  //   const navigation: JQuery = $('#jsi-jnl-navigation');
  //   let summaryPaneWidth: number = 0;
  //   let activePaneLength: number = 0;
  //
  //   $panes.each(function() {
  //     if ( _this.isPaneShown($(this)) ) {
  //       summaryPaneWidth += $(this).innerWidth();
  //       ++activePaneLength;
  //     }
  //   });
  //
  //   const paneMargin: number = (windowWidth - navigation.innerWidth()) - summaryPaneWidth;
  //   const paneMarginThreshold: number = 100;
  //
  //   if (paneMargin >= 0) return;
  //
  //   const eachMargin: number = Math.abs(paneMargin);
  //
  //   $panes.each(function(i) {
  //     if ( i != 0 && _this.isPaneShown($(this)) ) {
  //       const currentLeftPosition: number = parseInt($(this).css('left'), 10);
  //       const positionDifference: number = eachMargin + paneMarginThreshold * ( i / activePaneLength );
  //       const targetLeftPosition: number = currentLeftPosition - positionDifference;
  //
  //       $(this).css({ left: `${targetLeftPosition}px`});
  //     }
  //   });
  }
}

new InitializeApp();
