(function() {
  var h = window.h;

  var BASE_STYLES = [
    '@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap");',
    '* { box-sizing: border-box; margin: 0; padding: 0; }',
    'body { font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; background: #000; color: #fff; }',
    'a { color: inherit; text-decoration: none; }',
  ].join('\n');

  function injectStyles(doc, extra) {
    var style = doc.createElement('style');
    style.textContent = BASE_STYLES + '\n' + (extra || '');
    doc.head.appendChild(style);
  }

  /* ── Shared style helpers ── */
  var C = {
    bg:      '#000',
    surface: 'rgba(10,10,10,.55)',
    glass:   'rgba(255,255,255,.06)',
    border:  'rgba(255,255,255,.10)',
    border2: 'rgba(255,255,255,.22)',
    red:     '#ef4444',
    red600:  '#dc2626',
    muted:   'rgba(255,255,255,.72)',
    body:    'rgba(255,255,255,.80)',
    dim:     'rgba(255,255,255,.55)',
    radius:  '18px',
    radiusSm:'14px',
  };

  function card(extra) {
    return Object.assign({
      borderRadius: C.radius,
      padding: '22px',
      border: '1px solid ' + C.border,
      background: C.surface,
      backdropFilter: 'blur(14px)',
      boxShadow: '0 20px 60px rgba(0,0,0,.45)',
      marginBottom: '20px',
    }, extra || {});
  }

  function chip(icon, text) {
    return h('span', {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        fontSize: '13px',
        fontWeight: '600',
        color: C.muted,
      }
    },
      h('span', { style: { width: '7px', height: '7px', borderRadius: '999px', background: C.red, flexShrink: 0, display: 'inline-block', boxShadow: '0 0 0 5px rgba(239,68,68,.12)' } }),
      text
    );
  }

  function sectionTitle(text) {
    return h('h2', {
      style: {
        fontWeight: '900',
        fontSize: '22px',
        letterSpacing: '-0.02em',
        marginBottom: '14px',
        color: '#fff',
      }
    }, text);
  }

  function bulletList(items, color) {
    return h('ul', {
      style: {
        listStyle: 'none',
        padding: 0,
        margin: 0,
        display: 'grid',
        gap: '6px',
      }
    },
      (items || []).map(function(item, i) {
        return h('li', {
          key: i,
          style: {
            display: 'flex',
            alignItems: 'flex-start',
            gap: '8px',
            fontSize: '14px',
            color: C.body,
            lineHeight: '1.65',
          }
        },
          h('span', { style: { color: color || C.red, flexShrink: 0, fontWeight: '700', marginTop: '1px' } }, '▸'),
          item
        );
      })
    );
  }

  function colBox(title, items) {
    return h('div', {
      style: {
        padding: '16px',
        borderRadius: '16px',
        border: '1px solid rgba(255,255,255,.08)',
        background: 'rgba(0,0,0,.25)',
      }
    },
      h('div', {
        style: {
          fontWeight: '900',
          fontSize: '14px',
          textTransform: 'uppercase',
          letterSpacing: '.06em',
          color: C.red,
          marginBottom: '10px',
        }
      }, title),
      bulletList(items)
    );
  }

  function previewBanner(text) {
    return h('div', {
      style: {
        background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
        padding: '9px 16px',
        borderRadius: '10px',
        marginBottom: '28px',
        textAlign: 'center',
        fontSize: '11px',
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: '.07em',
        color: '#fff',
      }
    }, text || 'LIVE PREVIEW');
  }

  function langBadge(text) {
    return h('div', {
      style: {
        display: 'inline-block',
        background: C.red600,
        color: '#fff',
        padding: '3px 10px',
        borderRadius: '6px',
        fontSize: '11px',
        fontWeight: '700',
        letterSpacing: '.05em',
        marginBottom: '14px',
      }
    }, text);
  }

  /* ════════════════════════════════
     JOB PREVIEW
  ════════════════════════════════ */
  var JobPreviewTemplate = window.createClass({
    render: function() {
      var data = this.props.entry.toJS().data;
      var en = data.en || {};
      var sl = data.sl || {};

      var wrap = {
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        background: C.bg,
        color: '#fff',
        padding: '32px 24px',
        minHeight: '100vh',
        lineHeight: '1.6',
      };

      function jobSection(langData, langLabel) {
        var hasContent = langData.title;
        if (!hasContent) return null;

        return h('div', { style: { marginBottom: '48px' } },
          langBadge(langLabel),

          /* Hero card */
          h('div', { style: card({ marginBottom: '16px' }) },
            h('div', { style: { display: 'flex', gap: '14px', alignItems: 'flex-start' } },
              h('div', {
                style: {
                  width: '54px', height: '54px', borderRadius: '14px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'rgba(239,68,68,.14)', border: '1px solid rgba(239,68,68,.22)',
                  flexShrink: 0, fontSize: '24px',
                }
              }, '🧳'),
              h('div', { style: { minWidth: 0 } },
                h('h1', {
                  style: {
                    fontWeight: '900',
                    fontSize: '32px',
                    letterSpacing: '-0.02em',
                    lineHeight: '1.1',
                    marginBottom: '10px',
                  }
                }, langData.title || '—'),
                h('div', {
                  style: {
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '14px',
                    marginBottom: langData.description ? '14px' : 0,
                  }
                },
                  langData.location   && chip('📍', langData.location),
                  langData.type       && chip('💼', langData.type),
                  langData.department && chip('🏢', langData.department),
                  langData.salary     && chip('💰', langData.salary)
                ),
                langData.description && h('p', {
                  style: { color: C.body, fontSize: '15px', lineHeight: '1.75', margin: 0 }
                }, langData.description)
              )
            )
          ),

          /* Apply button */
          h('div', { style: { marginBottom: '20px' } },
            h('a', {
              href: '#',
              style: {
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '13px 22px', borderRadius: C.radiusSm,
                background: C.red, color: '#fff',
                fontWeight: '800', fontSize: '15px',
                boxShadow: '0 12px 30px rgba(239,68,68,.25)',
                border: '1px solid rgba(255,255,255,.10)',
              }
            }, 'Apply for this position →')
          ),

          /* Detail card */
          (langData.salary || langData.description || (langData.responsibilities && langData.responsibilities.length) || (langData.requirements && langData.requirements.length) || (langData.benefits && langData.benefits.length)) &&
          h('div', { style: card() },
            sectionTitle('Full Description'),

            langData.salary && h('div', null,
              h('div', {
                style: {
                  color: C.muted, fontWeight: '800', fontSize: '13px',
                  textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: '6px',
                }
              }, 'Compensation'),
              h('div', { style: { fontWeight: '900', fontSize: '18px', marginBottom: '16px' } },
                langData.salary
              ),
              h('hr', {
                style: {
                  height: '1px', border: 0, margin: '18px 0',
                  background: 'linear-gradient(to right, transparent, rgba(255,255,255,.14), transparent)',
                }
              })
            ),

            langData.description && h('div', {
              style: { color: C.body, fontSize: '15px', lineHeight: '1.75', marginBottom: '18px' }
            }, langData.description),

            (langData.responsibilities || langData.requirements || langData.benefits) &&
            h('div', {
              style: {
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '14px',
                marginTop: '12px',
              }
            },
              langData.requirements    && langData.requirements.length    && colBox(langLabel === 'ENGLISH' ? 'Requirements' : 'Zahteve', langData.requirements),
              langData.responsibilities && langData.responsibilities.length && colBox(langLabel === 'ENGLISH' ? 'Responsibilities' : 'Naloge', langData.responsibilities),
              langData.benefits        && langData.benefits.length        && colBox(langLabel === 'ENGLISH' ? 'Benefits' : 'Ugodnosti', langData.benefits)
            )
          )
        );
      }

      return h('div', { style: wrap },
        previewBanner('Live Preview — Job Listing'),
        jobSection(en, 'ENGLISH'),
        en.title && sl.title && h('hr', {
          style: {
            height: '1px', border: 0, margin: '8px 0 40px',
            background: 'linear-gradient(to right, transparent, rgba(255,255,255,.18), transparent)',
          }
        }),
        jobSection(sl, 'SLOVENSKO')
      );
    }
  });

  /* ════════════════════════════════
     ARTICLE PREVIEW
  ════════════════════════════════ */
  var ArticlePreviewTemplate = window.createClass({
    render: function() {
      var data = this.props.entry.toJS().data;
      var en = data.en || {};
      var sl = data.sl || {};

      var wrap = {
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        background: C.bg,
        color: '#fff',
        padding: '32px 24px',
        minHeight: '100vh',
        lineHeight: '1.6',
      };

      function articleSection(langData, langLabel) {
        if (!langData.title) return null;
        return h('div', { style: { marginBottom: '48px' } },
          langBadge(langLabel),

          langData.coverImage && h('div', {
            style: {
              borderRadius: C.radius, overflow: 'hidden',
              marginBottom: '20px', maxHeight: '320px',
            }
          },
            h('img', {
              src: langData.coverImage,
              alt: langData.coverImageAlt || '',
              style: { width: '100%', height: '320px', objectFit: 'cover', display: 'block' }
            })
          ),

          h('div', { style: card() },
            h('div', {
              style: {
                display: 'flex', flexWrap: 'wrap', gap: '12px',
                alignItems: 'center', marginBottom: '14px',
              }
            },
              langData.category && h('span', {
                style: {
                  display: 'inline-block',
                  background: 'rgba(239,68,68,.14)',
                  border: '1px solid rgba(239,68,68,.25)',
                  color: C.red,
                  padding: '3px 10px', borderRadius: '6px',
                  fontSize: '12px', fontWeight: '700', letterSpacing: '.05em',
                }
              }, langData.category),
              langData.readTime && h('span', {
                style: { fontSize: '13px', color: C.dim, fontWeight: '600' }
              }, langData.readTime)
            ),

            h('h1', {
              style: {
                fontWeight: '900', fontSize: '32px',
                letterSpacing: '-0.02em', lineHeight: '1.15',
                marginBottom: '14px',
              }
            }, langData.title),

            langData.shortDescription && h('p', {
              style: {
                color: C.muted, fontSize: '16px', lineHeight: '1.7',
                marginBottom: '20px',
                borderLeft: '3px solid ' + C.red,
                paddingLeft: '14px',
              }
            }, langData.shortDescription),

            langData.body && h('div', {
              style: { color: C.body, fontSize: '15px', lineHeight: '1.8', whiteSpace: 'pre-wrap' }
            }, langData.body)
          )
        );
      }

      return h('div', { style: wrap },
        previewBanner('Live Preview — Article'),
        articleSection(en, 'ENGLISH'),
        en.title && sl.title && h('hr', {
          style: {
            height: '1px', border: 0, margin: '8px 0 40px',
            background: 'linear-gradient(to right, transparent, rgba(255,255,255,.18), transparent)',
          }
        }),
        articleSection(sl, 'SLOVENSKO')
      );
    }
  });

  /* ════════════════════════════════
     HOME PREVIEW
  ════════════════════════════════ */
  var HomePreviewTemplate = window.createClass({
    render: function() {
      var data = this.props.entry.toJS().data;

      var wrap = {
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        background: C.bg,
        color: '#fff',
        padding: '32px 24px',
        minHeight: '100vh',
      };

      return h('div', { style: wrap },
        previewBanner('Live Preview — Home Page'),

        /* Hero */
        h('div', {
          style: {
            textAlign: 'center',
            padding: '60px 0 48px',
            maxWidth: '820px',
            margin: '0 auto 40px',
          }
        },
          h('h1', {
            style: {
              fontWeight: '900', fontSize: '48px',
              letterSpacing: '-0.03em', lineHeight: '1.1',
              marginBottom: '18px',
            }
          },
            (data.hero && data.hero.titleLine1) || 'Title Line 1',
            h('br'),
            h('span', { style: { color: C.red } },
              (data.hero && data.hero.titleLine2) || 'Title Line 2'
            )
          ),
          h('p', {
            style: {
              color: C.muted, fontSize: '18px', lineHeight: '1.7',
              maxWidth: '600px', margin: '0 auto 28px',
            }
          }, (data.hero && data.hero.description) || ''),
          h('div', { style: { display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' } },
            h('button', {
              style: {
                background: C.red, color: '#fff', padding: '13px 26px',
                border: 'none', borderRadius: C.radiusSm, fontSize: '15px', fontWeight: '700', cursor: 'pointer',
              }
            }, (data.hero && data.hero.primaryCta && data.hero.primaryCta.label) || 'Primary CTA'),
            h('button', {
              style: {
                background: C.glass, color: '#fff', padding: '13px 26px',
                border: '1px solid ' + C.border, borderRadius: C.radiusSm, fontSize: '15px', fontWeight: '700', cursor: 'pointer',
              }
            }, (data.hero && data.hero.secondaryCta && data.hero.secondaryCta.label) || 'Secondary CTA')
          )
        ),

        /* Services */
        data.services && data.services.core && h('div', { style: { marginBottom: '40px' } },
          h('h2', {
            style: {
              fontWeight: '900', fontSize: '28px', letterSpacing: '-0.02em',
              textAlign: 'center', marginBottom: '24px',
            }
          }, (data.services && data.services.title) || 'Services'),
          h('div', {
            style: {
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px',
            }
          },
            (data.services.core || []).map(function(s, i) {
              return h('div', { key: i, style: card({ marginBottom: 0 }) },
                h('h3', { style: { fontWeight: '800', fontSize: '16px', marginBottom: '8px' } }, s.title || ''),
                h('p', { style: { color: C.body, fontSize: '14px', lineHeight: '1.6' } }, s.description || '')
              );
            })
          )
        ),

        /* Benefits */
        data.benefits && data.benefits.items && h('div', { style: { marginBottom: '40px' } },
          h('h2', {
            style: {
              fontWeight: '900', fontSize: '28px', letterSpacing: '-0.02em',
              textAlign: 'center', marginBottom: '24px',
            }
          }, (data.benefits && data.benefits.title) || 'Benefits'),
          h('div', {
            style: {
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px',
            }
          },
            (data.benefits.items || []).map(function(item, i) {
              return h('div', { key: i, style: card({ marginBottom: 0 }) },
                h('h3', { style: { fontWeight: '800', fontSize: '16px', marginBottom: '8px' } }, item.title || ''),
                h('p', { style: { color: C.body, fontSize: '14px', lineHeight: '1.6' } }, item.description || '')
              );
            })
          )
        )
      );
    }
  });

  /* ════════════════════════════════
     ABOUT PREVIEW
  ════════════════════════════════ */
  var AboutPreviewTemplate = window.createClass({
    render: function() {
      var data = this.props.entry.toJS().data;

      var wrap = {
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        background: C.bg,
        color: '#fff',
        padding: '32px 24px',
        minHeight: '100vh',
      };

      return h('div', { style: wrap },
        previewBanner('Live Preview — About Page'),

        /* Hero */
        h('div', {
          style: { textAlign: 'center', padding: '40px 0 36px', maxWidth: '700px', margin: '0 auto 32px' }
        },
          h('h1', {
            style: { fontWeight: '900', fontSize: '40px', letterSpacing: '-0.02em', marginBottom: '14px' }
          }, (data.hero && data.hero.title) || 'About'),
          h('p', {
            style: { color: C.muted, fontSize: '17px', lineHeight: '1.7' }
          }, (data.hero && data.hero.subtitle) || '')
        ),

        data.vision && h('div', { style: card() },
          h('h2', { style: { color: C.red, fontWeight: '900', fontSize: '20px', marginBottom: '10px' } },
            data.vision.title || 'Vision'
          ),
          h('p', { style: { color: C.body, fontSize: '15px', lineHeight: '1.75' } }, data.vision.text || '')
        ),

        data.mission && h('div', { style: card() },
          h('h2', { style: { color: C.red, fontWeight: '900', fontSize: '20px', marginBottom: '10px' } },
            data.mission.title || 'Mission'
          ),
          h('p', { style: { color: C.body, fontSize: '15px', lineHeight: '1.75' } }, data.mission.text || '')
        ),

        data.values && data.values.length > 0 && h('div', null,
          h('h2', {
            style: { fontWeight: '900', fontSize: '26px', textAlign: 'center', marginBottom: '20px' }
          }, 'Values'),
          h('div', {
            style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '24px' }
          },
            data.values.map(function(v, i) {
              return h('div', { key: i, style: card({ marginBottom: 0 }) },
                h('div', { style: { fontSize: '28px', marginBottom: '10px' } }, v.icon || '⭐'),
                h('h3', { style: { fontWeight: '800', color: C.red, marginBottom: '6px' } }, v.title || ''),
                h('p', { style: { color: C.body, fontSize: '14px', lineHeight: '1.6' } }, v.description || '')
              );
            })
          )
        ),

        data.stats && data.stats.length > 0 && h('div', {
          style: {
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '14px', marginBottom: '24px'
          }
        },
          data.stats.map(function(s, i) {
            return h('div', { key: i, style: Object.assign(card({ marginBottom: 0 }), { textAlign: 'center' }) },
              h('div', { style: { fontSize: '42px', fontWeight: '900', color: C.red, marginBottom: '6px' } }, s.number || '0'),
              h('div', { style: { color: C.muted, fontSize: '13px' } }, s.label || '')
            );
          })
        )
      );
    }
  });

  /* ── Register ── */
  if (window.CMS) {
    window.CMS.registerPreviewTemplate('jobs', JobPreviewTemplate);
    window.CMS.registerPreviewTemplate('home', HomePreviewTemplate);
    window.CMS.registerPreviewTemplate('about', AboutPreviewTemplate);

    /* Try to register article preview under common collection names */
    try { window.CMS.registerPreviewTemplate('articles', ArticlePreviewTemplate); } catch(e) {}
    try { window.CMS.registerPreviewTemplate('blog', ArticlePreviewTemplate); } catch(e) {}
    try { window.CMS.registerPreviewTemplate('insights', ArticlePreviewTemplate); } catch(e) {}
  }
})();
