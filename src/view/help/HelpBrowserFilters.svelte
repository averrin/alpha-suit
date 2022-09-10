<h1>Alpha Browser filters & sortings</h1>
<h2>Predifined filters & sortings</h2>
<p>
   If you are using not DnD5e, your system can be unsupported. It means you should use the Advanced mode to filter
   showed content.
</p>
<ul>
   <li>For supported systems the left panel is filled with "Sortings" and "Filters", defined by developers.</li>
   <li>
      You can enable sveral sortings in the same time. Toggle sortings by clicking on them. An arrow right of the
      sorting's name is the direction of sort.
   </li>

   <li>Filters are combined by categories displayed as collapsible cards.</li>
   <li>
      For now there are quite a few available filter inputs: text input, single/multi-select and "compare a number".
      Their usage is strightforward.
   </li>
   <li>Filters combines by "and" logic. If you want "or" logic, you should use the Advanced Mode.</li>
</ul>
<h2>Advanced mode</h2>
<p>You can enable the Filter Bar (like in the tree view) in the Settings tab.</p>
<p>Predifined filters are one-way synced with the Filter Bar.</p>
<ul>
   <li>If you write several filters separately, they will be combined by <tt>and</tt>.</li>
   <li>
      Filter which doesn't contains "@" symbol traits as string search. Exact match for tags and regex match for strings
      (smart-case)
   </li>
   <li>
      Query language powered by <a
         class="ui-link ui-link-accent"
         href="https://github.com/joewalnes/filtrex"
         target="_blank">Filtrex</a
      >. You can use all its power.
   </li>
   <li>
      To access the document's property, use @-notation. For example, <tt>@data.details.cr</tt> will transform into
      <tt>getProperty(document, "data.details.cr")</tt>.
   </li>
</ul>

<h3>Examples</h3>
<ul>
   <li>
      <tt class="ui-badge">@data.details.cr >= 2</tt> shows dnd5e actors with Challange Rating >= 2
   </li>
   <li>
      <tt class="ui-badge">@data.rarity == "legendary"</tt> shows dnd5e items with Legendary rarity
   </li>
</ul>
