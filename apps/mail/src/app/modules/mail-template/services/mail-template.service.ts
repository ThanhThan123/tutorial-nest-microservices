import { Injectable } from '@nestjs/common';
import { join } from 'path';
import { renderFile } from 'ejs';
@Injectable()
export class MailTemplateService {
  private templateDir = join(__dirname, 'templates');

  async render(templateName: string, data: any): Promise<any> {
    const content = await renderFile(join(this.templateDir, `${templateName}.ejs`), data);

    const html = await renderFile(join(this.templateDir, 'layout.ejs'), { content });
    return html;
  }
}
