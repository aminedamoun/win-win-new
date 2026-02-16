// Preview templates for Netlify CMS
// This makes the CMS interface visual and user-friendly

// Helper to safely get image URLs
const getImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return path.startsWith('/') ? path : `/${path}`;
};

const HomePreviewTemplate = ({ entry }) => {
  const data = entry.getIn(['data']).toJS();

  return `
    <div style="font-family: Inter, sans-serif; background: #000; color: #fff; padding: 40px; min-height: 100vh;">

      <!-- Preview Helper Banner -->
      <div style="background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); padding: 16px; border-radius: 12px; margin-bottom: 40px; text-align: center;">
        <strong style="font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">✓ LIVE PREVIEW - This is how your page will look</strong>
      </div>

      <!-- Hero Section -->
      <section style="margin-bottom: 80px; text-align: center;">
        <div style="max-width: 900px; margin: 0 auto;">
          <h1 style="font-size: 56px; font-weight: 700; line-height: 1.1; margin: 0 0 24px 0; background: linear-gradient(135deg, #fff 0%, #999 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
            ${data.hero?.titleLine1 || ''}<br>
            ${data.hero?.titleLine2 || ''}
          </h1>
          <p style="font-size: 20px; color: #9ca3af; line-height: 1.6; margin-bottom: 32px;">
            ${data.hero?.description || ''}
          </p>
          <div style="display: flex; gap: 16px; justify-content: center; flex-wrap: wrap;">
            <button style="background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); color: white; padding: 14px 32px; border: none; border-radius: 12px; font-size: 16px; font-weight: 600; cursor: pointer; box-shadow: 0 12px 28px rgba(220,38,38,.35);">
              ${data.hero?.primaryCta?.label || 'Primary CTA'}
            </button>
            <button style="background: rgba(255,255,255,.06); color: white; padding: 14px 32px; border: 1px solid rgba(255,255,255,.12); border-radius: 12px; font-size: 16px; font-weight: 600; cursor: pointer;">
              ${data.hero?.secondaryCta?.label || 'Secondary CTA'}
            </button>
          </div>
        </div>
      </section>

      <!-- About Section -->
      <section style="margin-bottom: 80px; background: rgba(255,255,255,.06); border: 1px solid rgba(255,255,255,.12); border-radius: 18px; padding: 60px 40px;">
        <div style="max-width: 800px; margin: 0 auto; text-align: center;">
          <h2 style="font-size: 42px; font-weight: 700; margin: 0 0 20px 0;">
            ${data.about?.title || 'About Title'}
          </h2>
          <p style="font-size: 18px; color: #d1d5db; line-height: 1.7; margin-bottom: 48px;">
            ${data.about?.description || ''}
          </p>

          ${data.about?.stats ? `
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 32px; margin-top: 48px;">
              ${data.about.stats.map(stat => `
                <div>
                  <div style="font-size: 48px; font-weight: 700; color: #dc2626; margin-bottom: 8px;">
                    ${stat.value || ''}
                  </div>
                  <div style="font-size: 14px; color: #9ca3af; text-transform: uppercase; letter-spacing: 1px;">
                    ${stat.label || ''}
                  </div>
                </div>
              `).join('')}
            </div>
          ` : ''}
        </div>
      </section>

      <!-- Services Section -->
      ${data.services ? `
        <section style="margin-bottom: 80px;">
          <div style="max-width: 800px; margin: 0 auto 60px; text-align: center;">
            <h2 style="font-size: 42px; font-weight: 700; margin: 0 0 20px 0;">
              ${data.services.title || 'Services Title'}
            </h2>
            <p style="font-size: 18px; color: #d1d5db; line-height: 1.7;">
              ${data.services.description || ''}
            </p>
          </div>

          <!-- Core Services -->
          ${data.services.core ? `
            <div style="margin-bottom: 48px;">
              <h3 style="font-size: 24px; font-weight: 600; margin-bottom: 24px; color: #dc2626;">
                ${data.services.blocks?.core || 'Core Services'}
              </h3>
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px;">
                ${data.services.core.map(service => `
                  <div style="background: rgba(255,255,255,.06); border: 1px solid rgba(255,255,255,.12); border-radius: 14px; padding: 32px;">
                    <div style="font-size: 40px; margin-bottom: 16px;">📦</div>
                    <h4 style="font-size: 20px; font-weight: 600; margin: 0 0 12px 0;">
                      ${service.title || ''}
                    </h4>
                    <p style="font-size: 15px; color: #9ca3af; line-height: 1.6; margin: 0;">
                      ${service.description || ''}
                    </p>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}

          <!-- Support Services -->
          ${data.services.support ? `
            <div style="margin-bottom: 48px;">
              <h3 style="font-size: 24px; font-weight: 600; margin-bottom: 24px; color: #dc2626;">
                ${data.services.blocks?.support || 'Support Services'}
              </h3>
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px;">
                ${data.services.support.map(service => `
                  <div style="background: rgba(255,255,255,.06); border: 1px solid rgba(255,255,255,.12); border-radius: 14px; padding: 32px;">
                    <div style="font-size: 40px; margin-bottom: 16px;">🎓</div>
                    <h4 style="font-size: 20px; font-weight: 600; margin: 0 0 12px 0;">
                      ${service.title || ''}
                    </h4>
                    <p style="font-size: 15px; color: #9ca3af; line-height: 1.6; margin: 0;">
                      ${service.description || ''}
                    </p>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}
        </section>
      ` : ''}

      <!-- Benefits Section -->
      ${data.benefits ? `
        <section style="margin-bottom: 80px;">
          <div style="max-width: 800px; margin: 0 auto 48px; text-align: center;">
            <h2 style="font-size: 42px; font-weight: 700; margin: 0 0 20px 0;">
              ${data.benefits.title || 'Benefits Title'}
            </h2>
            <p style="font-size: 18px; color: #d1d5db; line-height: 1.7;">
              ${data.benefits.description || ''}
            </p>
          </div>

          ${data.benefits.items ? `
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 24px;">
              ${data.benefits.items.map(item => `
                <div style="background: rgba(255,255,255,.06); border: 1px solid rgba(255,255,255,.12); border-radius: 14px; padding: 28px; text-align: center;">
                  <div style="font-size: 48px; margin-bottom: 16px;">✓</div>
                  <h4 style="font-size: 18px; font-weight: 600; margin: 0 0 8px 0;">
                    ${item.title || ''}
                  </h4>
                  <p style="font-size: 14px; color: #9ca3af; line-height: 1.6; margin: 0;">
                    ${item.description || ''}
                  </p>
                </div>
              `).join('')}
            </div>
          ` : ''}
        </section>
      ` : ''}

      <!-- CTA Section -->
      ${data.cta ? `
        <section style="background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); border-radius: 18px; padding: 60px 40px; text-align: center; box-shadow: 0 12px 28px rgba(220,38,38,.35);">
          <h2 style="font-size: 36px; font-weight: 700; margin: 0 0 16px 0;">
            ${data.cta.title || 'CTA Title'}
          </h2>
          <p style="font-size: 18px; color: rgba(255,255,255,.9); line-height: 1.6; margin-bottom: 32px;">
            ${data.cta.description || ''}
          </p>
          <button style="background: white; color: #dc2626; padding: 14px 32px; border: none; border-radius: 12px; font-size: 16px; font-weight: 600; cursor: pointer;">
            ${data.cta.buttonLabel || 'Get Started'}
          </button>
        </section>
      ` : ''}

    </div>
  `;
};

const AboutPreviewTemplate = ({ entry }) => {
  const data = entry.getIn(['data']).toJS();

  return `
    <div style="font-family: Inter, sans-serif; background: #000; color: #fff; padding: 40px;">

      <!-- Preview Helper Banner -->
      <div style="background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); padding: 16px; border-radius: 12px; margin-bottom: 40px; text-align: center;">
        <strong style="font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">✓ LIVE PREVIEW - This is how your page will look</strong>
      </div>

      <section style="max-width: 900px; margin: 0 auto 60px; text-align: center;">
        <h1 style="font-size: 52px; font-weight: 700; margin: 0 0 24px 0;">
          ${data.hero?.title || 'About Title'}
        </h1>
        <p style="font-size: 20px; color: #9ca3af; line-height: 1.6;">
          ${data.hero?.description || ''}
        </p>
      </section>

      ${data.story ? `
        <section style="max-width: 800px; margin: 0 auto 60px; background: rgba(255,255,255,.06); border: 1px solid rgba(255,255,255,.12); border-radius: 18px; padding: 48px;">
          <h2 style="font-size: 36px; font-weight: 700; margin: 0 0 20px 0;">
            ${data.story.title || 'Story Title'}
          </h2>
          <p style="font-size: 17px; color: #d1d5db; line-height: 1.7;">
            ${data.story.content || ''}
          </p>
        </section>
      ` : ''}

      ${data.values?.items ? `
        <section style="max-width: 1000px; margin: 0 auto 60px;">
          <h2 style="font-size: 36px; font-weight: 700; margin: 0 0 40px 0; text-align: center;">
            ${data.values.title || 'Values Title'}
          </h2>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px;">
            ${data.values.items.map(value => `
              <div style="background: rgba(255,255,255,.06); border: 1px solid rgba(255,255,255,.12); border-radius: 14px; padding: 32px;">
                <h3 style="font-size: 22px; font-weight: 600; margin: 0 0 12px 0; color: #dc2626;">
                  ${value.title || ''}
                </h3>
                <p style="font-size: 15px; color: #9ca3af; line-height: 1.6; margin: 0;">
                  ${value.description || ''}
                </p>
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

    </div>
  `;
};

// Register the templates
CMS.registerPreviewTemplate('home', HomePreviewTemplate);
CMS.registerPreviewTemplate('about', AboutPreviewTemplate);
