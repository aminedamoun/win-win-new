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
            data.hero?.subtitle || 'About subtitle'
          )
        ),

        // Vision
        data.vision && window.h('div', { style: Object.assign({}, styles.section, styles.card) },
          window.h('h2', { style: Object.assign({}, styles.sectionTitle, { marginBottom: '16px', color: '#dc2626' }) },
            data.vision.title || 'Our Vision'
          ),
          window.h('p', { style: styles.cardText },
            data.vision.text || 'Vision text goes here'
          )
        ),

        // Mission
        data.mission && window.h('div', { style: Object.assign({}, styles.section, styles.card) },
          window.h('h2', { style: Object.assign({}, styles.sectionTitle, { marginBottom: '16px', color: '#dc2626' }) },
            data.mission.title || 'Our Mission'
          ),
          window.h('p', { style: styles.cardText },
            data.mission.text || 'Mission text goes here'
          )
        ),

        // Values
        data.values && data.values.length > 0 && window.h('div', { style: styles.section },
          window.h('h2', { style: styles.sectionTitle },
            'Core Values'
          ),
          window.h('div', { style: styles.grid },
            data.values.map(function(value, i) {
              return window.h('div', { key: i, style: styles.card },
                window.h('div', { style: { fontSize: '32px', marginBottom: '12px' } },
                  value.icon || '⭐'
                ),
                window.h('h3', { style: Object.assign({}, styles.cardTitle, { color: '#dc2626' }) },
                  value.title || 'Value ' + (i + 1)
                ),
                window.h('p', { style: styles.cardText },
                  value.description || 'Value description'
                )
              );
            })
          )
        ),

        // Culture
        data.culture && window.h('div', { style: Object.assign({}, styles.section, styles.card) },
          window.h('h2', { style: Object.assign({}, styles.sectionTitle, { marginBottom: '16px' }) },
            data.culture.title || 'Company Culture'
          ),
          window.h('p', { style: Object.assign({}, styles.cardText, { marginBottom: '20px' }) },
            data.culture.description || 'Culture description'
          ),
          data.culture.highlights && data.culture.highlights.length > 0 && window.h('ul', {
            style: { listStyle: 'none', padding: 0, display: 'grid', gap: '12px' }
          },
            data.culture.highlights.map(function(highlight, i) {
              return window.h('li', {
                key: i,
                style: {
                  color: '#d1d5db',
                  fontSize: '14px',
                  padding: '12px 16px',
                  background: 'rgba(220, 38, 38, 0.1)',
                  borderRadius: '8px',
                  borderLeft: '3px solid #dc2626'
                }
              }, '✓ ' + highlight);
            })
          )
        ),

        // Statistics
        data.stats && data.stats.length > 0 && window.h('div', { style: styles.section },
          window.h('h2', { style: styles.sectionTitle },
            'Our Impact'
          ),
          window.h('div', { style: styles.grid },
            data.stats.map(function(stat, i) {
              return window.h('div', {
                key: i,
                style: Object.assign({}, styles.card, { textAlign: 'center' })
              },
                window.h('div', {
                  style: {
                    fontSize: '48px',
                    fontWeight: '700',
                    color: '#dc2626',
                    marginBottom: '8px'
                  }
                }, stat.number || '0'),
                window.h('div', { style: { color: '#9ca3af', fontSize: '14px' } },
                  stat.label || 'Metric'
                )
              );
            })
          )
        )
      );
    }
  });

  const JobPreviewTemplate = window.createClass({
    render: function() {
      const entry = this.props.entry;
      const data = entry.toJS().data;
      const styles = createPreviewStyles();
      const enData = data.en || {};
      const slData = data.sl || {};

      return window.h('div', { style: styles.container },
        // Banner
        window.h('div', { style: styles.banner },
          '✓ LIVE PREVIEW - See your changes instantly'
        ),

        // Job Header - English
        window.h('div', { style: Object.assign({}, styles.hero, { marginBottom: '40px' }) },
          window.h('div', {
            style: {
              display: 'inline-block',
              background: '#dc2626',
              color: 'white',
              padding: '4px 12px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: '600',
              marginBottom: '16px'
            }
          }, 'ENGLISH VERSION'),
          window.h('h1', { style: Object.assign({}, styles.title, { marginBottom: '12px' }) },
            enData.title || 'Job Title (EN)'
          ),
          window.h('div', {
            style: {
              display: 'flex',
              gap: '16px',
              justifyContent: 'center',
              flexWrap: 'wrap',
              fontSize: '14px',
              color: '#9ca3af',
              marginBottom: '16px'
            }
          },
            window.h('span', null, '📍 ' + (enData.location || 'Location')),
            window.h('span', null, '💼 ' + (enData.type || 'Full-time')),
            enData.department && window.h('span', null, '🏢 ' + enData.department),
            enData.salary && window.h('span', null, '💰 ' + enData.salary)
          ),
          window.h('p', { style: styles.subtitle },
            enData.description || 'Job description goes here'
          )
        ),

        // Responsibilities - English
        enData.responsibilities && enData.responsibilities.length > 0 && window.h('div', { style: Object.assign({}, styles.section, styles.card) },
          window.h('h2', { style: Object.assign({}, styles.cardTitle, { fontSize: '24px', marginBottom: '16px', color: '#dc2626' }) },
            'Responsibilities'
          ),
          window.h('ul', { style: { listStyle: 'none', padding: 0, display: 'grid', gap: '8px' } },
            enData.responsibilities.map(function(resp, i) {
              return window.h('li', {
                key: i,
                style: { color: '#d1d5db', fontSize: '14px', paddingLeft: '20px', position: 'relative' }
              }, [
                window.h('span', { key: 'bullet', style: { position: 'absolute', left: 0, color: '#dc2626' } }, '▸'),
                resp
              ]);
            })
          )
        ),

        // Requirements - English
        enData.requirements && enData.requirements.length > 0 && window.h('div', { style: Object.assign({}, styles.section, styles.card) },
          window.h('h2', { style: Object.assign({}, styles.cardTitle, { fontSize: '24px', marginBottom: '16px', color: '#dc2626' }) },
            'Requirements'
          ),
          window.h('ul', { style: { listStyle: 'none', padding: 0, display: 'grid', gap: '8px' } },
            enData.requirements.map(function(req, i) {
              return window.h('li', {
                key: i,
                style: { color: '#d1d5db', fontSize: '14px', paddingLeft: '20px', position: 'relative' }
              }, [
                window.h('span', { key: 'bullet', style: { position: 'absolute', left: 0, color: '#dc2626' } }, '▸'),
                req
              ]);
            })
          )
        ),

        // Benefits - English
        enData.benefits && enData.benefits.length > 0 && window.h('div', { style: Object.assign({}, styles.section, styles.card) },
          window.h('h2', { style: Object.assign({}, styles.cardTitle, { fontSize: '24px', marginBottom: '16px', color: '#dc2626' }) },
            'Benefits'
          ),
          window.h('div', { style: styles.grid },
            enData.benefits.map(function(benefit, i) {
              return window.h('div', {
                key: i,
                style: {
                  padding: '12px 16px',
                  background: 'rgba(220, 38, 38, 0.1)',
                  borderRadius: '8px',
                  fontSize: '14px',
                  color: '#d1d5db'
                }
              }, '✓ ' + benefit);
            })
          )
        ),

        // Divider
        window.h('div', {
          style: {
            borderTop: '2px solid rgba(255,255,255,.12)',
            margin: '60px auto',
            maxWidth: '1000px'
          }
        }),

        // Job Header - Slovenian
        window.h('div', { style: Object.assign({}, styles.hero, { marginBottom: '40px' }) },
          window.h('div', {
            style: {
              display: 'inline-block',
              background: '#dc2626',
              color: 'white',
              padding: '4px 12px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: '600',
              marginBottom: '16px'
            }
          }, 'SLOVENSKA RAZLIČICA'),
          window.h('h1', { style: Object.assign({}, styles.title, { marginBottom: '12px' }) },
            slData.title || 'Naslov delovnega mesta (SL)'
          ),
          window.h('div', {
            style: {
              display: 'flex',
              gap: '16px',
              justifyContent: 'center',
              flexWrap: 'wrap',
              fontSize: '14px',
              color: '#9ca3af',
              marginBottom: '16px'
            }
          },
            window.h('span', null, '📍 ' + (slData.location || 'Lokacija')),
            window.h('span', null, '💼 ' + (slData.type || 'Polni delovni čas')),
            slData.department && window.h('span', null, '🏢 ' + slData.department),
            slData.salary && window.h('span', null, '💰 ' + slData.salary)
          ),
          window.h('p', { style: styles.subtitle },
            slData.description || 'Opis delovnega mesta'
          )
        ),

        // Responsibilities - Slovenian
        slData.responsibilities && slData.responsibilities.length > 0 && window.h('div', { style: Object.assign({}, styles.section, styles.card) },
          window.h('h2', { style: Object.assign({}, styles.cardTitle, { fontSize: '24px', marginBottom: '16px', color: '#dc2626' }) },
            'Odgovornosti'
          ),
          window.h('ul', { style: { listStyle: 'none', padding: 0, display: 'grid', gap: '8px' } },
            slData.responsibilities.map(function(resp, i) {
              return window.h('li', {
                key: i,
                style: { color: '#d1d5db', fontSize: '14px', paddingLeft: '20px', position: 'relative' }
              }, [
                window.h('span', { key: 'bullet', style: { position: 'absolute', left: 0, color: '#dc2626' } }, '▸'),
                resp
              ]);
            })
          )
        ),

        // Requirements - Slovenian
        slData.requirements && slData.requirements.length > 0 && window.h('div', { style: Object.assign({}, styles.section, styles.card) },
          window.h('h2', { style: Object.assign({}, styles.cardTitle, { fontSize: '24px', marginBottom: '16px', color: '#dc2626' }) },
            'Zahteve'
          ),
          window.h('ul', { style: { listStyle: 'none', padding: 0, display: 'grid', gap: '8px' } },
            slData.requirements.map(function(req, i) {
              return window.h('li', {
                key: i,
                style: { color: '#d1d5db', fontSize: '14px', paddingLeft: '20px', position: 'relative' }
              }, [
                window.h('span', { key: 'bullet', style: { position: 'absolute', left: 0, color: '#dc2626' } }, '▸'),
                req
              ]);
            })
          )
        ),

        // Benefits - Slovenian
        slData.benefits && slData.benefits.length > 0 && window.h('div', { style: Object.assign({}, styles.section, styles.card) },
          window.h('h2', { style: Object.assign({}, styles.cardTitle, { fontSize: '24px', marginBottom: '16px', color: '#dc2626' }) },
            'Ugodnosti'
          ),
          window.h('div', { style: styles.grid },
            slData.benefits.map(function(benefit, i) {
              return window.h('div', {
                key: i,
                style: {
                  padding: '12px 16px',
                  background: 'rgba(220, 38, 38, 0.1)',
                  borderRadius: '8px',
                  fontSize: '14px',
                  color: '#d1d5db'
                }
              }, '✓ ' + benefit);
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
    window.CMS.registerPreviewTemplate('jobs', JobPreviewTemplate);
  }
})();
