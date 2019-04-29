fetch(
  //"https://boblechef.com/wp-json/wp/v2/posts?_embed&categories=24,22,11,28,16,1,12,537,521,530,563,29,33,14&per_page=100&page=14&categories_exclude=27,466",
  //"https://boblechef.com/wp-json/wp/v2/categories?per_page=100&page=1&exclude=466,27",
  //"blc-posts.json",
  {
    method: "GET"
  }
)
  .then(res => res.json())
  .then(res => {
    console.log(res);

    const getCategories = res.map(t => {
      return {
        //name: t.name,
        id: t.id
      };
    });

    //console.log([getCategories]);

    res.map((data, i) => {
      parser = new DOMParser();
      doc = parser.parseFromString(data.content.rendered, "text/html");

      const postsData = {
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
        content: data.content.rendered,
        taxonomies: type => {
          const CatTaxonomy = data._embedded["wp:term"][0]
            ? data._embedded["wp:term"][type].map(t => {
                return `<category domain="${
                  type === 0 ? "category" : "post_tag"
                }" nicename="${t.slug}"><![CDATA[${t.name}]]></category>`;
              })
            : "";

          return CatTaxonomy;
        }
      };

      //console.log(postsData.content);

      const xmlTemplate = `
		<item>
				<title>${postsData.titre}</title>
				<link>${postsData.link}</link>
				<pubDate>${postsData.date}</pubDate>
				<dc:creator><![CDATA[${postsData.creator_name}]]></dc:creator>
				<guid isPermaLink="false">${postsData.link}</guid>
				<description>${postsData.content}</description>
				<content:encoded><![CDATA[${postsData.content}]]></content:encoded>
				<excerpt:encoded><![CDATA[${postsData.excerpt}]]></excerpt:encoded>
				<wp:post_id>${postsData.id}</wp:post_id>
				<wp:post_date><![CDATA[${postsData.date}]]></wp:post_date>
				<wp:post_date_gmt><![CDATA[]]></wp:post_date_gmt>
				<wp:comment_status><![CDATA[${postsData.comment_status}]]></wp:comment_status>
				<wp:ping_status><![CDATA[${postsData.ping_status}]]></wp:ping_status>
				<wp:post_name><![CDATA[${postsData.slug}]]></wp:post_name>
				<wp:status><![CDATA[publish]]></wp:status>
				<wp:post_parent>0</wp:post_parent>
				<wp:menu_order>0</wp:menu_order>
				<wp:post_type><![CDATA[post]]></wp:post_type>
				<wp:post_password><![CDATA[]]></wp:post_password>
				<wp:is_sticky>0</wp:is_sticky>
				${postsData
          .taxonomies(0)
          .join()
          .toString()}
				${postsData
          .taxonomies(1)
          .join()
          .toString()}

		</item>
	  `;

      //console.log(postsData);

      const xmlTemplateFiltered = xmlTemplate
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

      const nodeXml = document.createElement("div");
      nodeXml.innerHTML = xmlTemplateFiltered;
      document.getElementById("main").appendChild(nodeXml);
    });
  });
