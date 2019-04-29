fetch(
  "https://website-address.com/wp-json/wp/v2/posts?_embed&per_page=6&page=1&categories=27",
  //"blc.json",
  {
    method: "GET"
  }
)
  .then(res => res.json())
  .then(res => {
    console.log(res);

    res.map((data, i) => {
      parser = new DOMParser();
      doc = parser.parseFromString(data.content.rendered, "text/html");

      const recettesData = {
        titre: data.title.rendered,
        id: data.id,
        slug: data.slug,
        titre: data.title.rendered,
        link: data.link,
        date: data.date,
        excerpt: data.excerpt.rendered,
        author: data.author,
        comment_status: data.comment_status,
        ping_status: data.ping_status,
        author: data.author,
        creator_name: data._embedded.author[0].name,
        feature_image: data._embedded["wp:featuredmedia"]
          ? data._embedded["wp:featuredmedia"][0].link
          : "",
        content: cls => {
          const findClass = doc.querySelectorAll(`${cls}`);
          const result = findClass[0] ? findClass[0] : "";

          return result;
        },
        taxonomies: type => {
          const CatTaxonomy = data._embedded["wp:term"][0]
            ? data._embedded["wp:term"][type].map(t => {
                return `<category domain="${
                  type === 0 ? "types" : "ingredients"
                }" nicename="${t.slug}"><![CDATA[${t.name}]]></category>`;
              })
            : "";

          return CatTaxonomy;
        }
      };

      const xmlTemplate = `
		<item>
				<title>${recettesData.titre}</title>
				<link>${recettesData.link}</link>
				<pubDate>${recettesData.date}</pubDate>
				<dc:creator><![CDATA[${recettesData.creator_name}]]></dc:creator>
				<guid isPermaLink="false">${recettesData.link}</guid>
				<description>${
          recettesData.content("[itemprop=description]").innerHTML
        }</description>
				<content:encoded><![CDATA[					
					<!-- wp:image {"id":52838} -->
						<figure class="wp-block-image"><img src="${
              recettesData.content("[itemprop=image]").src
            }" alt="${recettesData.titre}" class="wp-image-52838"/></figure>
					<!-- /wp:image -->
					${recettesData.content("[itemprop=description]").innerHTML}]]></content:encoded>
				<excerpt:encoded><![CDATA[${recettesData.excerpt}]]></excerpt:encoded>
				<wp:post_id>${recettesData.id}</wp:post_id>
				<wp:post_date><![CDATA[${recettesData.date}]]></wp:post_date>
				<wp:post_date_gmt><![CDATA[]]></wp:post_date_gmt>
				<wp:comment_status><![CDATA[${
          recettesData.comment_status
        }]]></wp:comment_status>
				<wp:ping_status><![CDATA[${recettesData.ping_status}]]></wp:ping_status>
				<wp:post_name><![CDATA[${recettesData.slug}]]></wp:post_name>
				<wp:status><![CDATA[publish]]></wp:status>
				<wp:post_parent>0</wp:post_parent>
				<wp:menu_order>0</wp:menu_order>
				<wp:post_type><![CDATA[recettes]]></wp:post_type>
				<wp:post_password><![CDATA[]]></wp:post_password>
				<wp:is_sticky>0</wp:is_sticky>
				${recettesData
          .taxonomies(0)
          .join()
          .toString()}
				${recettesData
          .taxonomies(1)
          .join()
          .toString()}
				<wp:postmeta>
					<wp:meta_key><![CDATA[_temp_de_preparation]]></wp:meta_key>
					<wp:meta_value><![CDATA[field_56abad3cb4888]]></wp:meta_value>
				</wp:postmeta>
				<wp:postmeta>
					<wp:meta_key><![CDATA[_temp_de_cuisson_]]></wp:meta_key>
					<wp:meta_value><![CDATA[field_56abad9713684]]></wp:meta_value>
				</wp:postmeta>
				<wp:postmeta>
					<wp:meta_key><![CDATA[_temp_total]]></wp:meta_key>
					<wp:meta_value><![CDATA[field_56abada9aefa0]]></wp:meta_value>
				</wp:postmeta>
				<wp:postmeta>
					<wp:meta_key><![CDATA[_nombre_de_portions]]></wp:meta_key>
					<wp:meta_value><![CDATA[field_56abade7f1814]]></wp:meta_value>
				</wp:postmeta>
				<wp:postmeta>
					<wp:meta_key><![CDATA[_ingredients]]></wp:meta_key>
					<wp:meta_value><![CDATA[field_56aa779f4bbb7]]></wp:meta_value>
				</wp:postmeta>
				<wp:postmeta>
					<wp:meta_key><![CDATA[_marche_à_suivre]]></wp:meta_key>
					<wp:meta_value><![CDATA[field_56abad25c5f81]]></wp:meta_value>
				</wp:postmeta>
				<wp:postmeta>
					<wp:meta_key><![CDATA[_notes]]></wp:meta_key>
					<wp:meta_value><![CDATA[field_56abadba6227a]]></wp:meta_value>
				</wp:postmeta>
				<wp:postmeta>
					<wp:meta_key><![CDATA[_video]]></wp:meta_key>
					<wp:meta_value><![CDATA[field_56abaf8eeca68]]></wp:meta_value>
				</wp:postmeta>
				<wp:postmeta>
					<wp:meta_key><![CDATA[ingredients]]></wp:meta_key>
					<wp:meta_value><![CDATA[${
            recettesData.content(".ERSIngredients")
              ? recettesData
                  .content(".ERSIngredients")
                  .innerHTML.replace("Ingrédients", "")
                  .replace(
                    '<div class="ERSIngredientsHeader ERSHeading"></div>',
                    ""
                  )
                  .trim()
              : ""
          }]]></wp:meta_value>
				</wp:postmeta>
				<wp:postmeta>
					<wp:meta_key><![CDATA[temp_de_preparation]]></wp:meta_key>
					<wp:meta_value><![CDATA[${
            recettesData.content("[itemprop=prepTime]").textContent
          }]]></wp:meta_value>tags custom post types reddit
				</wp:postmeta>
				<wp:postmeta>
					<wp:meta_key><![CDATA[temp_de_cuisson]]></wp:meta_key>
					<wp:meta_value><![CDATA[${
            recettesData.content("[itemprop=cookTime]").textContent
          }]]></wp:meta_value>
				</wp:postmeta>
				<wp:postmeta>
					<wp:meta_key><![CDATA[temp_total]]></wp:meta_key>
					<wp:meta_value><![CDATA[${
            recettesData.content("[itemprop=totalTime]").textContent
          }]]></wp:meta_value>
				</wp:postmeta>
				<wp:postmeta>
					<wp:meta_key><![CDATA[nombre_de_portions]]></wp:meta_key>
					<wp:meta_value><![CDATA[${
            recettesData.content("[itemprop=nutrition]")
              ? recettesData
                  .content("[itemprop=nutrition]")
                  .innerText.replace("Nombre de portions:", "")
              : "".trim()
          }]]></wp:meta_value>
				</wp:postmeta>
				<wp:postmeta>
					<wp:meta_key><![CDATA[marche_à_suivre]]></wp:meta_key>
					<wp:meta_value><![CDATA[${
            recettesData.content(".ERSInstructions")
              ? recettesData
                  .content(".ERSInstructions")
                  .innerHTML.replace("Marche à suivre", "")
                  .replace(
                    '<div class="ERSInstructionsHeader ERSHeading"></div>',
                    ""
                  )
              : ""
          }]]></wp:meta_value>
				</wp:postmeta>tags custom post types reddit
				<wp:postmeta>
					<wp:meta_key><![CDATA[notes]]></wp:meta_key>
					<wp:meta_value><![CDATA[${
            recettesData.content(".ERSNotes")
              ? recettesData.content(".ERSNotes").innerHTML
              : ""
          }]]></wp:meta_value>
				</wp:postmeta>
				<wp:postmeta>
					<wp:meta_key><![CDATA[video]]></wp:meta_key>
					<wp:meta_value><![CDATA[${
            recettesData.content("iframe")
              ? [...doc.querySelectorAll("iframe")]
                  .map(v => v.outerHTML)
                  .join("")
              : ""
          }]]></wp:meta_value>
				</wp:postmeta>
				<wp:postmeta>
					<wp:meta_key><![CDATA[_wp_page_template]]></wp:meta_key>
					<wp:meta_value><![CDATA[default]]></wp:meta_value>
				</wp:postmeta>
		</item>
	  `;

      console.log(recettesData);

      const xmlTemplateFiltered = xmlTemplate
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

      const nodeXml = document.createElement("div");
      nodeXml.innerHTML = xmlTemplateFiltered;
      document.getElementById("main").appendChild(nodeXml);
    });
  });
