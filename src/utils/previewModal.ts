import { Modal, App, ButtonComponent } from 'obsidian';
import { PrintPluginSettings } from '../types';
import { Printd } from 'printd';

export class PrintPreviewModal extends Modal {
    private content: HTMLElement;
    private cssString: string;
    private settings: PrintPluginSettings;

    constructor(
        app: App,
        content: HTMLElement,
        settings: PrintPluginSettings,
        cssString: string
    ) {
        super(app);
        this.content = content;
        this.settings = settings;
        this.cssString = cssString;
    }

    onOpen() {
        const { contentEl } = this;
        
        // Add title
        contentEl.createEl('h2', { text: 'Print Preview' });
        
        // Create preview container
        const previewContainer = contentEl.createDiv('print-preview-container');
        previewContainer.appendChild(this.content.cloneNode(true));
        
        // Apply print styles to preview
        const styleEl = contentEl.createEl('style');
        styleEl.textContent = this.cssString;
        
        // Add print button
        const buttonContainer = contentEl.createDiv('print-button-container');
        new ButtonComponent(buttonContainer)
            .setButtonText('Print')
            .onClick(() => {
                const htmlElement = this.generatePrintHtml();
                const d = new Printd();
                d.print(htmlElement, [this.cssString]);
                this.close();
            });
    }

    private generatePrintHtml(): HTMLElement {
        const htmlElement = document.createElement('html');
        const headElement = document.createElement('head');

        const titleElement = document.createElement('title');
        titleElement.textContent = 'Print note';
        headElement.appendChild(titleElement);

        if (this.settings.debugMode) {
            const styleElement = document.createElement('style');
            styleElement.textContent = this.cssString;
            headElement.appendChild(styleElement);
        }

        htmlElement.appendChild(headElement);

        const bodyElement = document.createElement('body');
        bodyElement.className = 'obsidian-print';
        bodyElement.appendChild(this.content.cloneNode(true));

        htmlElement.appendChild(bodyElement);

        return htmlElement;
    }

    onClose() {
        const { contentEl } = this;
        contentEl.empty();
    }
}