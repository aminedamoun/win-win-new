// Preview templates for Netlify CMS
const h = window.React.createElement;

const HomePreviewTemplate = ({ entry }) => {
  const data = entry.getIn(['data']).toJS();

  const sections = [];

  // Banner
  sections.push(
    h('div', {
      key: 'banner',
      style: {
        background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
        padding: '16px',
        borderRadius: '12px',
        marginBottom: '40px',
        textAlign: 'center'
      }
    }, h('strong', {
      style: {
        fontSize: '14px',
        textTransform: 'uppercase',
        letterSpacing: '1px'
      }
    }, '✓ LIVE PREVIEW - Changes appear in real-time'))
  );

  // Hero Section
  if (data.hero) {
    sections.push(
      h('section', {
        key: 'hero',
        style: { marginBottom: '80px', textAlign: 'center' }
      },
        h('div', { style: { maxWidth: '900px', margin: '0 auto' } }, [
          h('h1', {
            key: 'title',
            style: {
              fontSize: '48px',
              fontWeight: '700',
              lineHeight: '1.1',
              margin: '0 0 24px 0',
              color: '#fff'
            }
          }, [
            data.hero.titleLine1 || 'Title Line 1',
            h('br', { key: 'br' }),
            data.hero.titleLine2 || 'Title Line 2'
          ]),
          h('p', {
            key: 'desc',
            style: {
              fontSize: '18px',
              color: '#9ca3af',
              lineHeight: '1.6',
              marginBottom: '32px'
            }
          }, data.hero.description || 'Hero description goes here'),
          h('div', {
            key: 'ctas',
            style: {
              display: 'flex',
              gap: '16px',
              justifyContent: 'center',
              flexWrap: 'wrap'
            }
          }, [
            h('button', {
              key: 'primary',
              style: {
                background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
                color: 'white',
                padding: '12px 28px',
                border: 'none',
                borderRadius: '12px',
                fontSize: '15px',
                fontWeight: '600'
              }
            }, data.hero.primaryCta?.label || 'Primary Button'),
            h('button', {
              key: 'secondary',
              style: {
                background: 'rgba(255,255,255,.06)',
                color: 'white',
                padding: '12px 28px',
                border: '1px solid rgba(255,255,255,.12)',
                borderRadius: '12px',
                fontSize: '15px',
                fontWeight: '600'
              }
            }, data.hero.secondaryCta?.label || 'Secondary Button')
          ])
        ])
      )
    );
  }

  // About Section
  if (data.about) {
    sections.push(
      h('section', {
        key: 'about',
        style: {
          marginBottom: '60px',
          background: 'rgba(255,255,255,.06)',
          border: '1px solid rgba(255,255,255,.12)',
          borderRadius: '18px',
          padding: '48px 32px',
          textAlign: 'center'
        }
      }, [
        h('h2', {
          key: 'title',
          style: {
            fontSize: '36px',
            fontWeight: '700',
            margin: '0 0 16px 0',
            color: '#fff'
          }
        }, data.about.title || 'About Title'),
        h('p', {
          key: 'desc',
          style: {
            fontSize: '16px',
            color: '#d1d5db',
            lineHeight: '1.7',
            maxWidth: '700px',
            margin: '0 auto'
          }
        }, data.about.description || 'About description')
      ])
    );
  }

  // Services Section
  if (data.services) {
    const serviceCards = [];

    if (data.services.core && data.services.core.length > 0) {
      serviceCards.push(
        h('div', { key: 'core', style: { marginBottom: '32px' } }, [
          h('h3', {
            key: 'title',
            style: {
              fontSize: '22px',
              fontWeight: '600',
              marginBottom: '20px',
              color: '#dc2626'
            }
          }, data.services.blocks?.core || 'Core Services'),
          h('div', {
            key: 'grid',
            style: {
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '20px'
            }
          }, data.services.core.map((service, idx) =>
            h('div', {
              key: idx,
              style: {
                background: 'rgba(255,255,255,.06)',
                border: '1px solid rgba(255,255,255,.12)',
                borderRadius: '14px',
                padding: '24px',
                textAlign: 'left'
              }
            }, [
              h('h4', {
                key: 'title',
                style: {
                  fontSize: '18px',
                  fontWeight: '600',
                  margin: '0 0 10px 0',
                  color: '#fff'
                }
              }, service.title || 'Service'),
              h('p', {
                key: 'desc',
                style: {
                  fontSize: '14px',
                  color: '#9ca3af',
                  lineHeight: '1.6',
                  margin: 0
                }
              }, service.description || '')
            ])
          ))
        ])
      );
    }

    if (serviceCards.length > 0) {
      sections.push(
        h('section', {
          key: 'services',
          style: { marginBottom: '60px' }
        }, [
          h('h2', {
            key: 'title',
            style: {
              fontSize: '36px',
              fontWeight: '700',
              margin: '0 0 32px 0',
              textAlign: 'center',
              color: '#fff'
            }
          }, data.services.title || 'Services'),
          ...serviceCards
        ])
      );
    }
  }

  // Benefits Section
  if (data.benefits && data.benefits.items) {
    sections.push(
      h('section', {
        key: 'benefits',
        style: { marginBottom: '60px' }
      }, [
        h('h2', {
          key: 'title',
          style: {
            fontSize: '36px',
            fontWeight: '700',
            margin: '0 0 32px 0',
            textAlign: 'center',
            color: '#fff'
          }
        }, data.benefits.title || 'Benefits'),
        h('div', {
          key: 'grid',
          style: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '20px'
          }
        }, data.benefits.items.map((item, idx) =>
          h('div', {
            key: idx,
            style: {
              background: 'rgba(255,255,255,.06)',
              border: '1px solid rgba(255,255,255,.12)',
              borderRadius: '14px',
              padding: '24px',
              textAlign: 'center'
            }
          }, [
            h('h4', {
              key: 'title',
              style: {
                fontSize: '17px',
                fontWeight: '600',
                margin: '0 0 8px 0',
                color: '#fff'
              }
            }, item.title || 'Benefit'),
            h('p', {
              key: 'desc',
              style: {
                fontSize: '13px',
                color: '#9ca3af',
                lineHeight: '1.6',
                margin: 0
              }
            }, item.description || '')
          ])
        ))
      ])
    );
  }

  // CTA Section
  if (data.cta) {
    sections.push(
      h('section', {
        key: 'cta',
        style: {
          background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
          borderRadius: '18px',
          padding: '48px 32px',
          textAlign: 'center'
        }
      }, [
        h('h2', {
          key: 'title',
          style: {
            fontSize: '32px',
            fontWeight: '700',
            margin: '0 0 12px 0',
            color: '#fff'
          }
        }, data.cta.title || 'CTA Title'),
        h('p', {
          key: 'desc',
          style: {
            fontSize: '16px',
            color: 'rgba(255,255,255,.9)',
            lineHeight: '1.6',
            marginBottom: '24px'
          }
        }, data.cta.description || 'CTA description'),
        h('button', {
          key: 'btn',
          style: {
            background: 'white',
            color: '#dc2626',
            padding: '12px 28px',
            border: 'none',
            borderRadius: '12px',
            fontSize: '15px',
            fontWeight: '600'
          }
        }, data.cta.buttonLabel || 'Get Started')
      ])
    );
  }

  return h('div', {
    style: {
      fontFamily: 'Inter, -apple-system, sans-serif',
      background: '#000',
      color: '#fff',
      padding: '40px',
      minHeight: '100vh'
    }
  }, sections);
};

const AboutPreviewTemplate = ({ entry }) => {
  const data = entry.getIn(['data']).toJS();

  const sections = [];

  // Banner
  sections.push(
    h('div', {
      key: 'banner',
      style: {
        background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
        padding: '16px',
        borderRadius: '12px',
        marginBottom: '40px',
        textAlign: 'center'
      }
    }, h('strong', {
      style: {
        fontSize: '14px',
        textTransform: 'uppercase',
        letterSpacing: '1px'
      }
    }, '✓ LIVE PREVIEW - Changes appear in real-time'))
  );

  // Hero
  if (data.hero) {
    sections.push(
      h('section', {
        key: 'hero',
        style: {
          maxWidth: '900px',
          margin: '0 auto 60px',
          textAlign: 'center'
        }
      }, [
        h('h1', {
          key: 'title',
          style: {
            fontSize: '48px',
            fontWeight: '700',
            margin: '0 0 20px 0',
            color: '#fff'
          }
        }, data.hero.title || 'About Title'),
        h('p', {
          key: 'desc',
          style: {
            fontSize: '18px',
            color: '#9ca3af',
            lineHeight: '1.6'
          }
        }, data.hero.description || 'About description')
      ])
    );
  }

  // Story
  if (data.story) {
    sections.push(
      h('section', {
        key: 'story',
        style: {
          maxWidth: '800px',
          margin: '0 auto 60px',
          background: 'rgba(255,255,255,.06)',
          border: '1px solid rgba(255,255,255,.12)',
          borderRadius: '18px',
          padding: '40px'
        }
      }, [
        h('h2', {
          key: 'title',
          style: {
            fontSize: '32px',
            fontWeight: '700',
            margin: '0 0 16px 0',
            color: '#fff'
          }
        }, data.story.title || 'Our Story'),
        h('p', {
          key: 'content',
          style: {
            fontSize: '16px',
            color: '#d1d5db',
            lineHeight: '1.7'
          }
        }, data.story.content || 'Story content goes here')
      ])
    );
  }

  // Values
  if (data.values && data.values.items) {
    sections.push(
      h('section', {
        key: 'values',
        style: {
          maxWidth: '1000px',
          margin: '0 auto'
        }
      }, [
        h('h2', {
          key: 'title',
          style: {
            fontSize: '32px',
            fontWeight: '700',
            margin: '0 0 32px 0',
            textAlign: 'center',
            color: '#fff'
          }
        }, data.values.title || 'Our Values'),
        h('div', {
          key: 'grid',
          style: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px'
          }
        }, data.values.items.map((value, idx) =>
          h('div', {
            key: idx,
            style: {
              background: 'rgba(255,255,255,.06)',
              border: '1px solid rgba(255,255,255,.12)',
              borderRadius: '14px',
              padding: '28px'
            }
          }, [
            h('h3', {
              key: 'title',
              style: {
                fontSize: '20px',
                fontWeight: '600',
                margin: '0 0 10px 0',
                color: '#dc2626'
              }
            }, value.title || 'Value'),
            h('p', {
              key: 'desc',
              style: {
                fontSize: '14px',
                color: '#9ca3af',
                lineHeight: '1.6',
                margin: 0
              }
            }, value.description || '')
          ])
        ))
      ])
    );
  }

  return h('div', {
    style: {
      fontFamily: 'Inter, -apple-system, sans-serif',
      background: '#000',
      color: '#fff',
      padding: '40px',
      minHeight: '100vh'
    }
  }, sections);
};

// Register the preview templates
CMS.registerPreviewTemplate('home', HomePreviewTemplate);
CMS.registerPreviewTemplate('about', AboutPreviewTemplate);
