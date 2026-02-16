// Simple visual preview templates for Netlify CMS
(function() {
  const createPreviewStyles = () => {
    return {
      container: {
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
        background: '#000',
        color: '#fff',
        padding: '40px 20px',
        minHeight: '100vh',
        lineHeight: '1.6'
      },
      banner: {
        background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
        padding: '12px 20px',
        borderRadius: '8px',
        marginBottom: '40px',
        textAlign: 'center',
        fontSize: '12px',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: '0.05em'
      },
      hero: {
        maxWidth: '900px',
        margin: '0 auto 60px',
        textAlign: 'center'
      },
      title: {
        fontSize: '42px',
        fontWeight: '700',
        lineHeight: '1.1',
        marginBottom: '20px',
        color: '#fff'
      },
      subtitle: {
        fontSize: '18px',
        color: '#9ca3af',
        marginBottom: '30px',
        lineHeight: '1.6'
      },
      buttonGroup: {
        display: 'flex',
        gap: '12px',
        justifyContent: 'center',
        flexWrap: 'wrap',
        marginTop: '24px'
      },
      buttonPrimary: {
        background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
        color: 'white',
        padding: '12px 28px',
        border: 'none',
        borderRadius: '8px',
        fontSize: '15px',
        fontWeight: '600',
        cursor: 'pointer'
      },
      buttonSecondary: {
        background: 'rgba(255,255,255,.06)',
        color: 'white',
        padding: '12px 28px',
        border: '1px solid rgba(255,255,255,.12)',
        borderRadius: '8px',
        fontSize: '15px',
        fontWeight: '600',
        cursor: 'pointer'
      },
      section: {
        maxWidth: '1000px',
        margin: '0 auto 50px'
      },
      sectionTitle: {
        fontSize: '28px',
        fontWeight: '700',
        marginBottom: '24px',
        textAlign: 'center',
        color: '#fff'
      },
      card: {
        background: 'rgba(255,255,255,.06)',
        border: '1px solid rgba(255,255,255,.12)',
        borderRadius: '12px',
        padding: '24px',
        marginBottom: '16px'
      },
      cardTitle: {
        fontSize: '18px',
        fontWeight: '600',
        marginBottom: '8px',
        color: '#fff'
      },
      cardText: {
        fontSize: '14px',
        color: '#d1d5db',
        lineHeight: '1.6'
      },
      grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '16px',
        marginTop: '24px'
      }
    };
  };

  const HomePreviewTemplate = window.createClass({
    render: function() {
      const entry = this.props.entry;
      const data = entry.toJS().data;
      const styles = createPreviewStyles();

      return window.h('div', { style: styles.container },
        // Banner
        window.h('div', { style: styles.banner },
          '✓ LIVE PREVIEW - See your changes instantly'
        ),

        // Hero Section
        window.h('div', { style: styles.hero },
          window.h('h1', { style: styles.title },
            (data.hero?.titleLine1 || 'Title Line 1') + ' ',
            window.h('br'),
            (data.hero?.titleLine2 || 'Title Line 2')
          ),
          window.h('p', { style: styles.subtitle },
            data.hero?.description || 'Add your hero description here'
          ),
          window.h('div', { style: styles.buttonGroup },
            window.h('button', { style: styles.buttonPrimary },
              data.hero?.primaryCta?.label || 'Primary Button'
            ),
            window.h('button', { style: styles.buttonSecondary },
              data.hero?.secondaryCta?.label || 'Secondary Button'
            )
          )
        ),

        // About Section
        data.about && window.h('div', { style: Object.assign({}, styles.section, styles.card) },
          window.h('h2', { style: Object.assign({}, styles.sectionTitle, { marginBottom: '12px' }) },
            data.about.title || 'About Title'
          ),
          window.h('p', { style: Object.assign({}, styles.cardText, { textAlign: 'center', maxWidth: '700px', margin: '0 auto' }) },
            data.about.description || 'About description'
          )
        ),

        // Services Section
        data.services && window.h('div', { style: styles.section },
          window.h('h2', { style: styles.sectionTitle },
            data.services.title || 'Our Services'
          ),
          data.services.core && data.services.core.length > 0 && window.h('div', null,
            window.h('h3', { style: { fontSize: '20px', fontWeight: '600', marginBottom: '16px', color: '#dc2626' } },
              data.services.blocks?.core || 'Core Services'
            ),
            window.h('div', { style: styles.grid },
              data.services.core.map(function(service, i) {
                return window.h('div', { key: i, style: styles.card },
                  window.h('h4', { style: styles.cardTitle },
                    service.title || 'Service ' + (i + 1)
                  ),
                  window.h('p', { style: styles.cardText },
                    service.description || 'Service description'
                  )
                );
              })
            )
          )
        ),

        // Benefits Section
        data.benefits && data.benefits.items && data.benefits.items.length > 0 && window.h('div', { style: styles.section },
          window.h('h2', { style: styles.sectionTitle },
            data.benefits.title || 'Benefits'
          ),
          window.h('div', { style: styles.grid },
            data.benefits.items.map(function(item, i) {
              return window.h('div', { key: i, style: styles.card },
                window.h('h4', { style: styles.cardTitle },
                  item.title || 'Benefit ' + (i + 1)
                ),
                window.h('p', { style: styles.cardText },
                  item.description || 'Benefit description'
                )
              );
            })
          )
        ),

        // CTA Section
        data.cta && window.h('div', {
          style: Object.assign({}, styles.card, {
            background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
            textAlign: 'center',
            padding: '40px 24px'
          })
        },
          window.h('h2', { style: Object.assign({}, styles.sectionTitle, { marginBottom: '12px' }) },
            data.cta.title || 'Call to Action'
          ),
          window.h('p', { style: Object.assign({}, styles.subtitle, { marginBottom: '24px' }) },
            data.cta.description || 'CTA description'
          ),
          window.h('button', {
            style: Object.assign({}, styles.buttonPrimary, {
              background: 'white',
              color: '#dc2626'
            })
          },
            data.cta.buttonLabel || 'Get Started'
          )
        )
      );
    }
  });

  const AboutPreviewTemplate = window.createClass({
    render: function() {
      const entry = this.props.entry;
      const data = entry.toJS().data;
      const styles = createPreviewStyles();

      return window.h('div', { style: styles.container },
        // Banner
        window.h('div', { style: styles.banner },
          '✓ LIVE PREVIEW - See your changes instantly'
        ),

        // Hero
        window.h('div', { style: styles.hero },
          window.h('h1', { style: styles.title },
            data.hero?.title || 'About Page Title'
          ),
          window.h('p', { style: styles.subtitle },
            data.hero?.description || 'About description'
          )
        ),

        // Story
        data.story && window.h('div', { style: Object.assign({}, styles.section, styles.card) },
          window.h('h2', { style: Object.assign({}, styles.sectionTitle, { marginBottom: '16px' }) },
            data.story.title || 'Our Story'
          ),
          window.h('p', { style: styles.cardText },
            data.story.content || 'Story content goes here'
          )
        ),

        // Values
        data.values && data.values.items && data.values.items.length > 0 && window.h('div', { style: styles.section },
          window.h('h2', { style: styles.sectionTitle },
            data.values.title || 'Our Values'
          ),
          window.h('div', { style: styles.grid },
            data.values.items.map(function(value, i) {
              return window.h('div', { key: i, style: styles.card },
                window.h('h3', { style: Object.assign({}, styles.cardTitle, { color: '#dc2626' }) },
                  value.title || 'Value ' + (i + 1)
                ),
                window.h('p', { style: styles.cardText },
                  value.description || 'Value description'
                )
              );
            })
          )
        )
      );
    }
  });

  // Register templates
  if (window.CMS) {
    window.CMS.registerPreviewTemplate('home', HomePreviewTemplate);
    window.CMS.registerPreviewTemplate('about', AboutPreviewTemplate);
  }
})();
